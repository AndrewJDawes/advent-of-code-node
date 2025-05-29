import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20169b from './b.js';
describe('Solution20169b', () => {
    describe('solve', () => {
        it('interprets (3x3)XYZ as 9', async () => {
            const input = new StringArray(['(3x3)XYZ']);
            const solution = await new Solution20169b(input).solve();
            expect(solution).to.equal('9');
        });
        it('interprets X(8x2)(3x3)ABCY as 20', async () => {
            const input = new StringArray(['X(8x2)(3x3)ABCY']);
            const solution = await new Solution20169b(input).solve();
            expect(solution).to.equal('20');
        });
        it('interprets (27x12)(20x12)(13x14)(7x10)(1x12)A as 241920', async () => {
            const input = new StringArray([
                '(27x12)(20x12)(13x14)(7x10)(1x12)A',
            ]);
            const solution = await new Solution20169b(input).solve();
            expect(solution).to.equal('241920');
        });
        it('interprets (25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN as 445', async () => {
            const input = new StringArray([
                '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN',
            ]);
            const solution = await new Solution20169b(input).solve();
            expect(solution).to.equal('445');
        });
        it('interprets (3x3)XYZ\nX(8x2)(3x3)ABCY\n(27x12)(20x12)(13x14)(7x10)(1x12)A\n(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN as 242394', async () => {
            const input = new StringArray([
                '(3x3)XYZ',
                'X(8x2)(3x3)ABCY',
                '(27x12)(20x12)(13x14)(7x10)(1x12)A',
                '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN',
            ]);
            const solution = await new Solution20169b(input).solve();
            expect(solution).to.equal('242394');
        });
    });
});
