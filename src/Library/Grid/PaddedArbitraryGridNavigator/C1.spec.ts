import { expect } from 'chai';
import C1 from './C1.js';
import FactoryC1 from '../Matrix/Factory/C1.js';
describe('Library Grid NumericGridNavigator C1', () => {
    describe('move', () => {
        it('errors when creating out of bounds position for column that does not exist', () => {
            expect(() => {
                const c1 = new C1(
                    new FactoryC1([
                        ['1'],
                        ['2', '3', '4'],
                        ['5', '6', '7', '8', '9'],
                        ['A', 'B', 'C'],
                        ['D'],
                    ]).build(),
                    {
                        rowNumber: 3,
                        columnNumber: 0,
                    }
                );
            }).to.throw('Column number out of bounds');
        });
        it('errors when moving out of bounds to a column that does not exist', () => {
            const c1 = new C1(
                new FactoryC1([
                    ['1'],
                    ['2', '3', '4'],
                    ['5', '6', '7', '8', '9'],
                    ['A', 'B', 'C'],
                    ['D'],
                ]).build(),
                {
                    rowNumber: 3,
                    columnNumber: 2,
                }
            );
            expect(() => c1.move({ rowNumber: 1, columnNumber: 1 })).to.throw(
                'Column number out of bounds'
            );
        });
        it('errors when moving out of bounds to a row that does not exist', () => {
            const c1 = new C1(
                new FactoryC1([
                    ['1'],
                    ['2', '3', '4'],
                    ['5', '6', '7', '8', '9'],
                    ['A', 'B', 'C'],
                    ['D'],
                ]).build(),
                {
                    rowNumber: 4,
                    columnNumber: 2,
                }
            );
            expect(() => c1.move({ rowNumber: 1, columnNumber: 0 })).to.throw(
                'Row number out of bounds'
            );
        });
        it('expects starting position to be 0,0', () => {
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
            });
        });
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
            c1.move({ rowNumber: 1, columnNumber: 0 });
            expect(c1.getCurrentPositionValue()).to.equal('B');
        });
        it('gets value D when moving 2,0', () => {
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
            c1.move({ rowNumber: 2, columnNumber: 0 });
            expect(c1.getCurrentPositionValue()).to.equal('D');
        });
        it('gets value 8 when moving 0,1', () => {
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
            c1.move({ rowNumber: 0, columnNumber: 1 });
            expect(c1.getCurrentPositionValue()).to.equal('8');
        });
        it('gets value 4 when moving -1,1', () => {
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
            c1.move({ rowNumber: -1, columnNumber: 1 });
            expect(c1.getCurrentPositionValue()).to.equal('4');
        });
    });
});
