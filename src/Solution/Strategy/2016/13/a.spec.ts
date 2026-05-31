import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution201613a from './a.js';
describe('Solution 201613a', () => {
    it('solves the official example via input fetcher', async () => {
        const input = new StringArray(['10']);
        const solution = await new Solution201613a(
            input,
            [1, 1],
            [7, 4],
        ).solve();
        expect(solution).to.equal('11');
    });
});
