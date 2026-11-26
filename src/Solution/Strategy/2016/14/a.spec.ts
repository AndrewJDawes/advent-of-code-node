import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution201614a from './a.js';
describe('Solution201614a', () => {
    describe('solve', () => {
        it('gets the 64th key given salt abc', async () => {
            const input = new StringArray([
                'abc', // real +123
            ]);
            const solution = await new Solution201614a(input).solve();
            expect(solution).to.equal('22728');
        }).timeout(0);
    });
});
