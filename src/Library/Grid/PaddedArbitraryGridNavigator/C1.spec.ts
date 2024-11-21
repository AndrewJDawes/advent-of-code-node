import { expect } from 'chai';
import C1 from './C1.js';
import MatrixC1 from '../Matrix/C1.js';
import JustifiedPaddedRowC1 from '../Row/JustifiedPaddedRowC1.js';
import FactoryC1 from '../Matrix/Factory/C1.js';
describe('Library Grid NumericGridNavigator C1', () => {
    describe('move', () => {
        it('gets value B when moving 1,0', () => {
            const c1 = new C1(
                new FactoryC1([
                    ['1'],
                    ['2', '3', '4'],
                    ['5', '6', '7', '8', '9'],
                    ['A', 'B', 'C'],
                    ['D'],
                ]).build(),
                {
                    rowNumber: 2,
                    columnNumber: 2,
                }
            );
            expect(c1.getCurrentPositionValue()).to.equal('7');
            c1.move({ rowNumber: 1, columnNumber: 0 });
            expect(c1.getCurrentPositionValue()).to.equal('B');
        });
        // it('interprets moving 3,1 from 1,1 on a 10x10 grid as ending at 4,2', () => {
        //     const c1 = new C1(
        //         {
        //             start: 1,
        //             step: 1,
        //             width: 10,
        //             height: 10,
        //         },
        //         {
        //             rowNumber: 1,
        //             columnNumber: 1,
        //         }
        //     );
        //     c1.move({
        //         rowNumber: 3,
        //         columnNumber: 1,
        //     });
        //     expect(c1.getCurrentPosition()).to.deep.equal({
        //         rowNumber: 4,
        //         columnNumber: 2,
        //     });
        //     expect(c1.getCurrentPositionValue()).to.equal(43);
        // });
    });
    // describe('getPositionValue', () => {
    //     it('interprets 1,1 on \n3\t5\t7\n9\t11\t13\n15\t17\t19\n grid as 11', () => {
    //         const c1 = new C1(
    //             {
    //                 start: 3,
    //                 step: 2,
    //                 width: 3,
    //                 height: 3,
    //             },
    //             {
    //                 rowNumber: 1,
    //                 columnNumber: 1,
    //             }
    //         );
    //         expect(
    //             c1.getPositionValue({ rowNumber: 1, columnNumber: 1 })
    //         ).to.equal(11);
    //     });
    //     it('interprets 2,0 on \n3\t5\t7\n9\t11\t13\n15\t17\t19\n grid as 11', () => {
    //         const c1 = new C1(
    //             {
    //                 start: 3,
    //                 step: 2,
    //                 width: 3,
    //                 height: 3,
    //             },
    //             {
    //                 rowNumber: 1,
    //                 columnNumber: 1,
    //             }
    //         );
    //         expect(
    //             c1.getPositionValue({ rowNumber: 2, columnNumber: 0 })
    //         ).to.equal(15);
    //     });
    // });
});
