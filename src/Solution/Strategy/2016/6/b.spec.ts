import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20166b from './b.js';
describe('Solution20166b', () => {
    describe('solve', () => {
        it('interprets eedadn\ndrvtee\neandsr\nraavrd\natevrs\ntsrnev\nsdttsa\nrasrtv\nnssdts\nntnada\nsvetve\ntesnvt\nvntsnd\nvrdear\ndvrsen\nenarar as advent', async () => {
            const input = new StringArray([
                'eedadn',
                'drvtee',
                'eandsr',
                'raavrd',
                'atevrs',
                'tsrnev',
                'sdttsa',
                'rasrtv',
                'nssdts',
                'ntnada',
                'svetve',
                'tesnvt',
                'vntsnd',
                'vrdear',
                'dvrsen',
                'enarar',
            ]);
            const solution = await new Solution20166b(input).solve();
            expect(solution).to.equal('advent');
        });
    });
});
