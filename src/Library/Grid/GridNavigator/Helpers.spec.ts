import { expect } from 'chai';
import { Direction } from './Interfaces.js';
import {
    directionCharacterToDirection,
    directionToDeltaPosition,
} from './Helpers.js';
describe('Library Grid GridNavigator Helpers', () => {
    describe('directionCharacterTodDirection', () => {
        it('interprets U as U', () => {
            expect(directionCharacterToDirection('U')).to.equal(Direction.U);
        });
        it('interprets R as R', () => {
            expect(directionCharacterToDirection('R')).to.equal(Direction.R);
        });
        it('errors when passed X', () => {
            expect(() => directionCharacterToDirection('X')).to.throw(
                'Invalid direction: X'
            );
        });
    });
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
