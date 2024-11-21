import { expect } from 'chai';
import { directionCharacterToDirection } from './Helpers.js';
import { Direction } from '../../../../Library/Grid/NumericGridNavigator/Interfaces.js';
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
});
