import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20162b from './b.js';
describe('Solution20162b', () => {
    describe('solve', () => {
        it('interprets ULL\nRRDDD\nLURDL\nUUUUD as 5DB3', async () => {
            const input = new StringArray(['ULL', 'RRDDD', 'LURDL', 'UUUUD']);
            const solution = await new Solution20162b(input).solve();
            expect(solution).to.equal('5DB3');
        });
    });
});
