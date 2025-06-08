import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);
import { CommandParser } from './common.js';
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
