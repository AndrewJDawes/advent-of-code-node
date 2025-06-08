import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);
import { Collector, CommandParser, Controller } from './common.js';
describe('201610 CommandParser', () => {
    const commandText1 = 'bot 59 gives low to bot 176 and high to bot 120';
    it(`interprets "${commandText1}"`, () => {
        const controller = {
            giveValue: sinon.spy(),
            transferHighAndLow: sinon.spy(),
        };
        const commandParser = new CommandParser(controller);
        commandParser.execute(commandText1);
        expect(controller.transferHighAndLow).to.have.been.calledWith({
            fromType: 'bot',
            fromId: 59,
            highToType: 'bot',
            highToId: 120,
            lowToType: 'bot',
            lowToId: 176,
        });
    });
    const commandText2 = 'bot 142 gives low to output 6 and high to bot 35';
    it(`interprets "${commandText2}"`, () => {
        const controller = {
            giveValue: sinon.spy(),
            transferHighAndLow: sinon.spy(),
        };
        const commandParser = new CommandParser(controller);
        commandParser.execute(commandText2);
        expect(controller.transferHighAndLow).to.have.been.calledWith({
            fromType: 'bot',
            fromId: 142,
            highToType: 'bot',
            highToId: 35,
            lowToType: 'output',
            lowToId: 6,
        });
    });
    const commandText3 = 'value 31 goes to bot 114';
    it(`interprets "${commandText3}"`, () => {
        const controller = {
            giveValue: sinon.spy(),
            transferHighAndLow: sinon.spy(),
        };
        const commandParser = new CommandParser(controller);
        commandParser.execute(commandText3);
        expect(controller.giveValue).to.have.been.calledWith('bot', 114, 31);
    });
});
describe('201610 Controller', () => {
    it('creates bots on giveValue', () => {
        const controller = new Controller({});
        controller.giveValue('bot', 23, 45);
        const bots = controller.getBots();
        const bot = bots.get(23);
        expect(bot).not.to.be.undefined;
        expect(bot?.getMicrochips()).to.eql([45]);
    });
    it('appends new values on giveValue', () => {
        const controller = new Controller({});
        controller.giveValue('bot', 23, 45);
        controller.giveValue('bot', 23, 48);
        const bots = controller.getBots();
        const bot = bots.get(23);
        expect(bot).not.to.be.undefined;
        expect(bot?.getMicrochips()).to.eql([45, 48]);
    });
    it('rejects appends beyond max', () => {
        const controller = new Controller({ botMaxMicrochips: 2 });
        controller.giveValue('bot', 23, 45);
        controller.giveValue('bot', 23, 48);
        expect(() => {
            controller.giveValue('bot', 23, 51);
        }).to.throw(
            `Unable to add new microchip: ${51}. Collector has reached maxMicrochips: ${2}`
        );
        const bots = controller.getBots();
        const bot = bots.get(23);
        expect(bot).not.to.be.undefined;
        expect(bot?.getMicrochips()).to.eql([45, 48]);
    });
    it('transfers low and high to output and bot', () => {
        // bot 161 gives low to output 14 and high to bot 185
        const controller = new Controller({ botMaxMicrochips: 3 });
        controller.giveValue('bot', 161, 5);
        controller.giveValue('bot', 161, 10);
        controller.giveValue('bot', 161, 25);
        controller.transferHighAndLow({
            fromType: 'bot',
            fromId: 161,
            lowToType: 'output',
            lowToId: 14,
            highToType: 'bot',
            highToId: 185,
        });
        const bots = controller.getBots();
        const outputs = controller.getOutputs();
        const bot161 = bots.get(161);
        const bot185 = bots.get(185);
        const output14 = outputs.get(14);
        expect(bot161).not.to.be.undefined;
        expect(bot185).not.to.be.undefined;
        expect(output14).not.to.be.undefined;
        expect(bot161?.getMicrochips()).to.eql([10]);
        expect(output14?.getMicrochips()).to.eql([5]);
        expect(bot185?.getMicrochips()).to.eql([25]);
    });
});
describe('201610 Collector', () => {
    it('compareAndReturnHighAndLowMicrochips with 2', () => {
        const collector = new Collector({});
        collector.addMicrochip(1);
        collector.addMicrochip(2);
        const { lowValue, highValue } =
            collector.compareAndReturnHighAndLowMicrochips();
        expect(lowValue).to.equal(1);
        expect(highValue).to.equal(2);
        expect(collector.getMicrochips()).to.deep.eq([]);
    });
    it('compareAndReturnHighAndLowMicrochips', () => {
        const collector = new Collector({ maxMicrochips: 4 });
        collector.addMicrochip(2);
        collector.addMicrochip(3);
        collector.addMicrochip(1);
        collector.addMicrochip(4);
        const { lowValue, highValue } =
            collector.compareAndReturnHighAndLowMicrochips();
        expect(lowValue).to.equal(1);
        expect(highValue).to.equal(4);
        expect(collector.getMicrochips()).to.deep.eq([2, 3]);
    });
    it('dispatches microchipAdded and microchipsCompared', () => {
        const collector = new Collector({});
        const handler1 = sinon.spy();
        const handler2 = sinon.spy();
        const handler3 = sinon.spy();
        collector.addEventHandler('microchipAdded', handler1);
        collector.addEventHandler('microchipAdded', handler2);
        collector.addEventHandler('microchipsCompared', handler3);
        collector.addMicrochip(1);
        expect(handler1).to.have.been.calledWith({ microchips: [1] });
        expect(handler2).to.have.been.calledWith({ microchips: [1] });
        expect(handler3).not.to.have.been.called;
        collector.addMicrochip(2);
        expect(handler1).to.have.been.calledWith({ microchips: [1, 2] });
        expect(handler2).to.have.been.calledWith({ microchips: [1, 2] });
        expect(handler3).not.to.have.been.called;
        collector.compareAndReturnHighAndLowMicrochips();
        expect(handler1).to.have.callCount(2);
        expect(handler2).to.have.callCount(2);
        expect(handler3).to.have.been.calledWith({
            microchips: [1, 2],
        });
    });
});
