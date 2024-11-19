import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20156a from './a.js';

describe('Solution 20156a', () => {
    describe('solve', () => {
        it('interprets "turn on 0,0 through 999,999", "toggle 0,0 through 999,0", and "turn off 499,499 through 500,500" as 998996', async () => {
            const arr = [
                'turn on 0,0 through 999,999',
                'toggle 0,0 through 999,0',
                'turn off 499,499 through 500,500',
            ];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20156a(stringArr).solve();
            expect(solution).to.equal('998996');
        });
    });
});
