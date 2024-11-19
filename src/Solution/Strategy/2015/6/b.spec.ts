import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20156b from './b.js';

describe('Solution 20156b', () => {
    describe('solve', () => {
        it('interprets "turn on 0,0 through 0,0" as 1', async () => {
            const arr = ['turn on 0,0 through 0,0'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20156b(stringArr).solve();
            expect(solution).to.equal('1');
        });
        it('interprets "toggle 0,0 through 999,999" as 2000000', async () => {
            const arr = ['toggle 0,0 through 999,999'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20156b(stringArr).solve();
            expect(solution).to.equal('2000000');
        });
    });
});
