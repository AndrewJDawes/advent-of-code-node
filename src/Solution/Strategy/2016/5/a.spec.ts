import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20165a from './a.js';
describe('Solution20165a', () => {
    describe('solve', () => {
        it('interprets ugkcyxxp', async () => {
            const input = new StringArray([
                'ugkcyxxp', // real +123
            ]);
            const solution = await new Solution20165a(input).solve();
            expect(solution).to.equal('d4cd2ee1');
        }).timeout(0);
    });
});
