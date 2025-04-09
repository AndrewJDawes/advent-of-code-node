import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20164a from './a.js';
describe('Solution20164a', () => {
    describe('solve', () => {
        it('interprets aaaaa-bbb-z-y-x-123[abxyz]\na-b-c-d-e-f-g-h-987[abcde]\nnot-a-real-room-404[oarel]\ntotally-real-room-200[decoy]', async () => {
            const input = new StringArray([
                'aaaaa-bbb-z-y-x-123[abxyz]', // real +123
                'a-b-c-d-e-f-g-h-987[abcde]', // real +987
                'not-a-real-room-404[oarel]', // real +404
                'totally-real-room-200[decoy]', // not real +0
            ]);
            const solution = await new Solution20164a(input).solve();
            expect(solution).to.equal('1514');
        });
    });
});
