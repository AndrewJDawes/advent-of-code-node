import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution201612a from './a.js';
describe('Solution 201612a', () => {
    it('solves the official example via input fetcher', async () => {
        const input = new StringArray([
            'cpy 41 a',
            'inc a',
            'inc a',
            'dec a',
            'jnz a 2',
            'dec a',
        ]);
        const solution = await new Solution201612a(input).solve();
        expect(solution).to.equal('42');
    });
});
