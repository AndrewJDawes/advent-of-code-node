import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20169a from './a.js';
describe('Solution20169a', () => {
    describe('solve', () => {
        it('interprets ADVENT as 6', async () => {
            const input = new StringArray(['ADVENT']);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('6');
        });
        it('interprets A(1x5)BC as 7', async () => {
            const input = new StringArray(['A(1x5)BC']);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('7');
        });
        it('interprets (3x3)XYZ as 9', async () => {
            const input = new StringArray(['(3x3)XYZ']);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('9');
        });
        it('interprets A(2x2)BCD(2x2)EFG as 11', async () => {
            const input = new StringArray(['A(2x2)BCD(2x2)EFG']);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('11');
        });
        it('interprets (6x1)(1x3)A as 6', async () => {
            const input = new StringArray(['(6x1)(1x3)A']);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('6');
        });
        it('interprets X(8x2)(3x3)ABCY as 18', async () => {
            const input = new StringArray(['X(8x2)(3x3)ABCY']);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('18');
        });
        it('interprets ADVENT\nA(1x5)BC\n(3x3)XYZ\nA(2x2)BCD(2x2)EFG\n(6x1)(1x3)A\nX(8x2)(3x3)ABC as 57', async () => {
            const input = new StringArray([
                'ADVENT',
                'A(1x5)BC',
                '(3x3)XYZ',
                'A(2x2)BCD(2x2)EFG',
                '(6x1)(1x3)A',
                'X(8x2)(3x3)ABCY',
            ]);
            const solution = await new Solution20169a(input).solve();
            expect(solution).to.equal('57');
        });
    });
});
