import { expect } from 'chai';
import StringArray from '../../../InputFetcher/Service/StringArray.js';
import Solution20151 from './1.js';

describe('Solution 20151', () => {
    describe('getAsyncIterator', () => {
        it('interprets (()(()( as 3', async () => {
            const arr = ['(()(()('];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20151(stringArr).solve();
            expect(solution).to.equal('3');
        });
    });
});
