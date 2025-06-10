import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);
import CommandParser from './C1.js';
describe('Graphic BitMap CommandParser C1', () => {
    it('draws a rect', () => {
        const controller = {
            rect: sinon.spy(),
            rotateRow: sinon.spy(),
            rotateColumn: sinon.spy(),
        };
        const commandParser = new CommandParser<boolean, null>(
            controller,
            true
        );
        commandParser.execute('rect 6x1');
        expect(controller.rect).to.have.been.calledWith(0, 0, 6, 1, true);
    });
    it('rotates a row', () => {
        const controller = {
            rect: sinon.spy(),
            rotateRow: sinon.spy(),
            rotateColumn: sinon.spy(),
        };
        const commandParser = new CommandParser<boolean, null>(
            controller,
            true
        );
        commandParser.execute('rotate row y=4 by 8');
        expect(controller.rotateRow).to.have.been.calledWith(4, 8);
    });
    it('rotates a column', () => {
        const controller = {
            rect: sinon.spy(),
            rotateRow: sinon.spy(),
            rotateColumn: sinon.spy(),
        };
        const commandParser = new CommandParser<boolean, null>(
            controller,
            true
        );
        commandParser.execute('rotate column x=36 by 3');
        expect(controller.rotateColumn).to.have.been.calledWith(36, 3);
    });
    it('throws on unexpected command', () => {
        const controller = {
            rect: sinon.spy(),
            rotateRow: sinon.spy(),
            rotateColumn: sinon.spy(),
        };
        const commandParser = new CommandParser<boolean, null>(
            controller,
            true
        );
        expect(() => {
            commandParser.execute('rotate columns x=36 by 3?');
        }).to.throw(
            'Command rotate requires indicator of dimension row or column. Received: rotate columns x=36 by 3?'
        );
    });
});
