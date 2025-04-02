import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20163a from './a.js';
describe('Solution20163a', () => {
    describe('solve', () => {
        it('interprets 5\t10\t5\n3\t3\t3\n as 2', async () => {
            const input = new StringArray(['5\t10\t5', '3\t3\t3', '4\t5\t6']);
            const solution = await new Solution20163a(input).solve();
            expect(solution).to.equal('2');
        });
        it('interprets     4   21  894 419  794  987 24  797  125 as 1', async () => {
            const input = new StringArray([
                '    4   21  894',
                '  419  794  987',
                '  424  797  125',
            ]);
            const solution = await new Solution20163a(input).solve();
            expect(solution).to.equal('1');
        });
    });
});
