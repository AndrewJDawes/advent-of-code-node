import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20164b from './b.js';
describe('Solution20164b', () => {
    describe('solve', () => {
        it('finds a room sector', async () => {
            const input = new StringArray([
                'bkwzkqsxq-tovvilokx-nozvyiwoxd-172[fstek]', // real +123
                'wifilzof-wbiwifuny-yhachyylcha-526[qrazx]', // real +987
                'jvyyvzpcl-jhukf-shivyhavyf-487[zhtsi]', // real +404
                'kwvacumz-ozilm-kivlg-kwvbiqvumvb-694[gknyw]', // not real +0
            ]);
            /*
            'rampaging jellybean deployment',
            'colorful chocolate engineering',
            'corrosive candy laboratory',
            'consumer grade candy containment',
            */
            const solution = await new Solution20164b(
                input,
                'corrosive candy laboratory'
            ).solve();
            expect(solution).to.equal('487');
        });
    });
});
