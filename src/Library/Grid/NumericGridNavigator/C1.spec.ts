import { expect } from 'chai';
import C1 from './C1.js';
describe('Library Grid NumericGridNavigator C1', () => {
    describe('getRowStartNumber', () => {
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 1, and has 3 wide rows to start at 4', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 1,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(c1.getRowStartNumber(1)).to.equal(4);
        });
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 2, and has 3 wide rows to start at 7', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 2,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(c1.getRowStartNumber(1)).to.equal(7);
        });
        it('calculates row 2 (index 0) of a grid that starts at 3, steps by 2, and has 4 wide rows to start at 19', () => {
            const c1 = new C1(
                {
                    start: 3,
                    step: 2,
                    width: 4,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(c1.getRowStartNumber(2)).to.equal(19);
        });
        it('errors when given row number 4 for a grid that is only 3 in height', () => {
            const c1 = new C1(
                {
                    start: 3,
                    step: 2,
                    width: 4,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(() => c1.getRowStartNumber(4)).to.throw(
                `Exceeded number of rows`
            );
        });
    });
    describe('getRowEndNumber', () => {
        it('calculates row 0 (index 0) of a grid that starts at 1, steps by 1, and has 3 wide rows to end at 3', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 1,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(c1.getRowEndNumber(0)).to.equal(3);
        });
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 1, and has 3 wide rows to end at 6', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 1,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(c1.getRowEndNumber(1)).to.equal(6);
        });
        it('calculates row 1 (index 0) of a grid that starts at 1, steps by 2, and has 3 wide rows to end at 11', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 2,
                    width: 3,
                    height: 3,
                },
                { rowNumber: 1, columnNumber: 1 }
            );
            expect(c1.getRowEndNumber(1)).to.equal(11);
        });
        it('errors when given row number 4 for a grid that is only 3 in height', () => {
            const c1 = new C1(
                {
                    start: 3,
                    step: 2,
                    width: 4,
                    height: 3,
                },
                { rowNumber: 1, columnNumber: 1 }
            );
            expect(() => c1.getRowEndNumber(4)).to.throw(
                `Exceeded number of rows`
            );
        });
    });

    describe('move', () => {
        it('errors when moving 2,1 from 1,1 on a 3x3 grid', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 1,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(() =>
                c1.move({
                    rowNumber: 3,
                    columnNumber: 1,
                })
            ).to.throw('Row number out of bounds');
        });
        it('interprets moving 3,1 from 1,1 on a 10x10 grid as ending at 4,2', () => {
            const c1 = new C1(
                {
                    start: 1,
                    step: 1,
                    width: 10,
                    height: 10,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            c1.move({
                rowNumber: 3,
                columnNumber: 1,
            });
            expect(c1.getCurrentPosition()).to.deep.equal({
                rowNumber: 4,
                columnNumber: 2,
            });
            expect(c1.getCurrentPositionValue()).to.equal(43);
        });
    });
    describe('getPositionValue', () => {
        it('interprets 1,1 on \n3\t5\t7\n9\t11\t13\n15\t17\t19\n grid as 11', () => {
            const c1 = new C1(
                {
                    start: 3,
                    step: 2,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(
                c1.getPositionValue({ rowNumber: 1, columnNumber: 1 })
            ).to.equal(11);
        });
        it('interprets 2,0 on \n3\t5\t7\n9\t11\t13\n15\t17\t19\n grid as 11', () => {
            const c1 = new C1(
                {
                    start: 3,
                    step: 2,
                    width: 3,
                    height: 3,
                },
                {
                    rowNumber: 1,
                    columnNumber: 1,
                }
            );
            expect(
                c1.getPositionValue({ rowNumber: 2, columnNumber: 0 })
            ).to.equal(15);
        });
    });
});
