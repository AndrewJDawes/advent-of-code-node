import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20162a, { Direction } from './a.js';
describe('Solution20162a', () => {
    // describe('solve', () => {
    //     it('interprets ULL\nRRDDD\nLURDL\nUUUUD as 1985', async () => {
    //         const input = new StringArray(['ULL', 'RRDDD', 'LURDL', 'UUUUD']);
    //         expect(new Solution20162a(input).solve()).to.equal('1985');
    //     });
    // });
    describe('getRowStartNumber', () => {
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 1, and has 3 wide rows to start at 4', () => {
            expect(
                Solution20162a.getRowStartNumber(
                    {
                        start: 1,
                        step: 1,
                        width: 3,
                        height: 3,
                    },
                    1
                )
            ).to.equal(4);
        });
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 2, and has 3 wide rows to start at 7', () => {
            expect(
                Solution20162a.getRowStartNumber(
                    {
                        start: 1,
                        step: 2,
                        width: 3,
                        height: 3,
                    },
                    1
                )
            ).to.equal(7);
        });
        it('calculates row 2 (index 0) of a grid that starts at 3, steps by 2, and has 4 wide rows to start at 19', () => {
            expect(
                Solution20162a.getRowStartNumber(
                    {
                        start: 3,
                        step: 2,
                        width: 4,
                        height: 3,
                    },
                    2
                )
            ).to.equal(19);
        });
        it('errors when given row number 4 for a grid that is only 3 in height', () => {
            expect(() =>
                Solution20162a.getRowStartNumber(
                    {
                        start: 3,
                        step: 2,
                        width: 4,
                        height: 3,
                    },
                    4
                )
            ).to.throw(`Exceeded number of rows`);
        });
    });
    describe('getRowEndNumber', () => {
        it('calculates row 0 (index 0) of a grid that starts at 1, steps by 1, and has 3 wide rows to end at 3', () => {
            expect(
                Solution20162a.getRowEndNumber(
                    {
                        start: 1,
                        step: 1,
                        width: 3,
                        height: 3,
                    },
                    0
                )
            ).to.equal(3);
        });
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 1, and has 3 wide rows to end at 6', () => {
            expect(
                Solution20162a.getRowEndNumber(
                    {
                        start: 1,
                        step: 1,
                        width: 3,
                        height: 3,
                    },
                    1
                )
            ).to.equal(6);
        });
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 2, and has 3 wide rows to end at 11', () => {
            expect(
                Solution20162a.getRowEndNumber(
                    {
                        start: 1,
                        step: 2,
                        width: 3,
                        height: 3,
                    },
                    1
                )
            ).to.equal(11);
        });
        it('errors when given row number 4 for a grid that is only 3 in height', () => {
            expect(() =>
                Solution20162a.getRowStartNumber(
                    {
                        start: 3,
                        step: 2,
                        width: 4,
                        height: 3,
                    },
                    4
                )
            ).to.throw(`Exceeded number of rows`);
        });
    });
    describe('directionCharacterTodDirection', () => {
        it('interprets U as U', () => {
            expect(Solution20162a.directionCharacterToDirection('U')).to.equal(
                Direction.U
            );
        });
        it('interprets R as R', () => {
            expect(Solution20162a.directionCharacterToDirection('R')).to.equal(
                Direction.R
            );
        });
        it('errors when passed X', () => {
            expect(() =>
                Solution20162a.directionCharacterToDirection('X')
            ).to.throw('Invalid direction: X');
        });
    });
    describe('directionToDeltaPosition', () => {
        it('interprets Direction.U as {rowNumber -1, columnNumber: 0}', () => {
            expect(
                Solution20162a.directionToDeltaPosition(Direction.U)
            ).to.deep.equal({
                rowNumber: -1,
                columnNumber: 0,
            });
        });
        it('interprets Direction.L as {rowNumber 0, columnNumber: -1}', () => {
            expect(
                Solution20162a.directionToDeltaPosition(Direction.L)
            ).to.deep.equal({
                rowNumber: 0,
                columnNumber: -1,
            });
        });
    });
    describe('move', () => {
        it('interprets moving 3,1 from 1,1 on a 3x3 grid as ending at 2,2', () => {
            expect(
                Solution20162a.move(
                    {
                        start: 1,
                        step: 1,
                        width: 3,
                        height: 3,
                    },
                    {
                        rowNumber: 1,
                        columnNumber: 1,
                    },
                    {
                        rowNumber: 3,
                        columnNumber: 1,
                    }
                )
            ).to.deep.equal({
                rowNumber: 2,
                columnNumber: 2,
            });
        });
        it('interprets moving 3,1 from 1,1 on a 10x10 grid as ending at 4,2', () => {
            expect(
                Solution20162a.move(
                    {
                        start: 1,
                        step: 1,
                        width: 10,
                        height: 10,
                    },
                    {
                        rowNumber: 1,
                        columnNumber: 1,
                    },
                    {
                        rowNumber: 3,
                        columnNumber: 1,
                    }
                )
            ).to.deep.equal({
                rowNumber: 4,
                columnNumber: 2,
            });
        });
    });
    describe('getPositionValue', () => {
        it('interprets 1,1 on \n3\t5\t7\n9\t11\t13\n15\t17\t19\n grid as 11', () => {
            expect(
                Solution20162a.getPositionValue(
                    {
                        start: 3,
                        step: 2,
                        width: 3,
                        height: 3,
                    },
                    { rowNumber: 1, columnNumber: 1 }
                )
            ).to.equal(11);
        });
        it('interprets 2,0 on \n3\t5\t7\n9\t11\t13\n15\t17\t19\n grid as 11', () => {
            expect(
                Solution20162a.getPositionValue(
                    {
                        start: 3,
                        step: 2,
                        width: 3,
                        height: 3,
                    },
                    { rowNumber: 2, columnNumber: 0 }
                )
            ).to.equal(15);
        });
    });
});
