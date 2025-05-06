import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20167a from './a.js';
describe('Solution20167a', () => {
    describe('solve', () => {
        it('interprets abba[mnop]qrst\nabcd[bddb]xyyx\naaaaa[qwer]tyui\nioxxoj[asdfgh]zxcvbn\nioxxoj[asdfgh]zxcvbnnbsfs\nioxxoj[abba]zxcvbnnbsfs\n as 3', async () => {
            const input = new StringArray([
                'abba[mnop]qrst',
                'abcd[bddb]xyyx',
                'aaaaa[qwer]tyui',
                'ioxxoj[asdfgh]zxcvbn',
                'ioxxoj[asdfgh]zxcvbnnbsfs',
                'ioxxoj[abba]zxcvbnnbsfs',
            ]);
            const solution = await new Solution20167a(input).solve();
            expect(solution).to.equal('3');
        });
    });
});
