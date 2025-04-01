import { expect } from 'chai';
import { Direction } from './Interfaces.js';
import { directionToDeltaPosition } from './Helpers.js';
describe('Library Grid NumericGridNavigator Helpers', () => {
    describe('directionToDeltaPosition', () => {
        it('interprets Direction.U as {rowNumber -1, columnNumber: 0}', () => {
            expect(directionToDeltaPosition(Direction.U)).to.deep.equal({
                rowNumber: -1,
                columnNumber: 0,
            });
        });
        it('interprets Direction.L as {rowNumber 0, columnNumber: -1}', () => {
            expect(directionToDeltaPosition(Direction.L)).to.deep.equal({
                rowNumber: 0,
                columnNumber: -1,
            });
        });
    });
});
