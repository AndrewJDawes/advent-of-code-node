import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20168a from './a.js';
describe('Solution20168a', () => {
    describe('solve', () => {
        it('interprets rect 3x2\nrotate column x=1 by 1\nrotate row y=0 by 4\nrotate column x=1 by 1\n as 3', async () => {
            const input = new StringArray([
                'rect 3x2',
                'rotate column x=1 by 1',
                'rotate row y=0 by 4',
                'rotate column x=1 by 1',
            ]);
            const solution = await new Solution20168a(input).solve();
            expect(solution).to.equal('6');
        });
    });
});
