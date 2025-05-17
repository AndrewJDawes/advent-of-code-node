import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import InputFetcherFactory from '../../../../InputFetcher/Factory/Default.js';
import Solution20168b from './b.js';
// TODO - use this: src/Library/Graphic/BitMap/Display/C2.ts
describe('Solution20168b', () => {
    describe('solve', () => {
        it('reads a display', async () => {
            const input = new InputFetcherFactory().getService(
                'url',
                'https://adventofcode.com/2016/day/8/input'
            );
            const solution = await new Solution20168b(input).solve();
            expect(solution).to.equal('6');
        });
    });
});
