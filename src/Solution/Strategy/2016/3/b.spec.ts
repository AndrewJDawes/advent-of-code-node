import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20163b from './b.js';
describe('Solution20163b', () => {
    describe('solve', () => {
        it('interprets     101 301 501\n102 302 502\n103 303 503\n201 401 601\n202 402 602\n203 403 603 as 6', async () => {
            const input = new StringArray([
                '101 301 501',
                '102 302 502',
                '103 303 503',
                '201 401 601',
                '202 402 602',
                '203 403 603',
            ]);
            const solution = await new Solution20163b(input).solve();
            expect(solution).to.equal('6');
        });
        it('interprets       4   21  894\n419  794  987\n424  797  125\n651  305  558\n655  631  963\n2  628  436 as 4', async () => {
            const input = new StringArray([
                '4   21  894',
                '419  794  987',
                '424  797  125',
                '651  305  558',
                '655  631  963',
                '  2  628  436',
            ]);
            const solution = await new Solution20163b(input).solve();
            expect(solution).to.equal('4');
        });
    });
});
