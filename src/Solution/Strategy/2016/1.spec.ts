import { expect } from 'chai';
import StringArray from '../../../InputFetcher/Service/StringArray.js';
import Solution20161, {
    Axis,
    CardinalDirection,
    Factor,
    HandDirection,
} from './1.js';

describe('Solution20161', () => {
    describe('solve', () => {
        it('interprets R2, L3 as 2', async () => {
            const arr = ['R2, L3'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20161(stringArr).solve();
            expect(solution).to.equal('5');
        });
        it('interprets R2, R2, R2 as 2', async () => {
            const arr = ['R2, R2, R2'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20161(stringArr).solve();
            expect(solution).to.equal('2');
        });
        it('interprets R5, L5, R5, R3 as 12', async () => {
            const arr = ['R5, L5, R5, R3'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20161(stringArr).solve();
            expect(solution).to.equal('12');
        });
    });
    describe('cardinalDirectionToAxis', () => {
        it('interprets North as NorthSouth', async () => {
            expect(
                Solution20161.cardinalDirectionToAxis(CardinalDirection.North)
            ).to.equal(Axis.NorthSouth);
        });
        it('interprets East as EastWest', async () => {
            expect(
                Solution20161.cardinalDirectionToAxis(CardinalDirection.East)
            ).to.equal(Axis.EastWest);
        });
        it('interprets South as NorthSouth', async () => {
            expect(
                Solution20161.cardinalDirectionToAxis(CardinalDirection.South)
            ).to.equal(Axis.NorthSouth);
        });
        it('interprets West as EastWest', async () => {
            expect(
                Solution20161.cardinalDirectionToAxis(CardinalDirection.West)
            ).to.equal(Axis.EastWest);
        });
    });
    describe('cardinalDirectionToFactor', () => {
        it('interprets North as NorthEast', async () => {
            expect(
                Solution20161.cardinalDirectionToFactor(CardinalDirection.North)
            ).to.equal(Factor.NorthEast);
        });
        it('interprets East as NorthEast', async () => {
            expect(
                Solution20161.cardinalDirectionToFactor(CardinalDirection.East)
            ).to.equal(Factor.NorthEast);
        });
        it('interprets South as SouthWest', async () => {
            expect(
                Solution20161.cardinalDirectionToFactor(CardinalDirection.South)
            ).to.equal(Factor.SouthWest);
        });
        it('interprets West as SouthWest', async () => {
            expect(
                Solution20161.cardinalDirectionToFactor(CardinalDirection.West)
            ).to.equal(Factor.SouthWest);
        });
    });
    describe('rotate', () => {
        it('calculates facing South and turning Right 1x as facing West', async () => {
            expect(
                Solution20161.rotate(
                    CardinalDirection.South,
                    HandDirection.R,
                    1
                )
            ).to.equal(CardinalDirection.West);
        });
        it('calculates facing South and turning Right 2x as facing North', async () => {
            expect(
                Solution20161.rotate(
                    CardinalDirection.South,
                    HandDirection.R,
                    2
                )
            ).to.equal(CardinalDirection.North);
        });
        it('calculates facing South and turning Right 3x as facing East', async () => {
            expect(
                Solution20161.rotate(
                    CardinalDirection.South,
                    HandDirection.R,
                    3
                )
            ).to.equal(CardinalDirection.East);
        });
        it('calculates facing South and turning Left 1x as facing East', async () => {
            expect(
                Solution20161.rotate(
                    CardinalDirection.South,
                    HandDirection.L,
                    1
                )
            ).to.equal(CardinalDirection.East);
        });
        it('calculates facing South and turning Left 2x as facing North', async () => {
            expect(
                Solution20161.rotate(
                    CardinalDirection.South,
                    HandDirection.L,
                    2
                )
            ).to.equal(CardinalDirection.North);
        });
        it('calculates facing South and turning Left 3x as facing West', async () => {
            expect(
                Solution20161.rotate(
                    CardinalDirection.South,
                    HandDirection.L,
                    3
                )
            ).to.equal(CardinalDirection.West);
        });
    });
    describe('parseInstruction', () => {
        it('interprets R23 as Right and 23', async () => {
            expect(Solution20161.parseInstruction('R23')).to.deep.equal({
                handDirection: HandDirection.R,
                movement: 23,
            });
        });
        it('interprets L101 as Left and 101', async () => {
            expect(Solution20161.parseInstruction('L101')).to.deep.equal({
                handDirection: HandDirection.L,
                movement: 101,
            });
        });
        it('fails to parse ABC', async () => {
            expect(() => Solution20161.parseInstruction('ABC')).to.throw(
                `Unable to parseInstruction: ABC`
            );
        });
        it('fails to parse Z12', async () => {
            expect(() => Solution20161.parseInstruction('Z12')).to.throw(
                `Unable to parseInstruction: Z12`
            );
        });
    });
});
