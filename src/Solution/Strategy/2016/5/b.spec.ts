import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20165b from './b.js';
describe('Solution20165b', () => {
    describe('solve', () => {
        it('interprets ugkcyxxp', async () => {
            const input = new StringArray([
                'ugkcyxxp', // real +123
            ]);
            const solution = await new Solution20165b(input).solve();
            expect(solution).to.equal('f2c730e5');
        }).timeout(0);
    });
});
