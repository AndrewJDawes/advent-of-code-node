import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20167b from './b.js';
describe('Solution20167b', () => {
    describe('solve', () => {
        it('interprets aba[bab]xyz\nxyx[xyx]xyx\naaa[kek]eke\nzazbz[bzb]cdb\n as 3', async () => {
            const input = new StringArray([
                'aba[bab]xyz',
                'xyx[xyx]xyx',
                'aaa[kek]eke',
                'zazbz[bzb]cdb',
            ]);
            const solution = await new Solution20167b(input).solve();
            expect(solution).to.equal('3');
        });
    });
});
