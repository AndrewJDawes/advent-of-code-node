import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution201611b from './b.js';
describe('Solution201611b', () => {
    it('solves unofficial example', async () => {
        const input = new StringArray([
            'The first floor contains nothing relevant.',
            'The second floor contains nothing relevant.',
            'The third floor contains nothing relevant.',
            'The fourth floor contains nothing relevant.',
        ]);
        const solution = await new Solution201611b(input).solve();
        expect(solution).to.equal('15');
    }); // 5 hours
    // it('solves official example', async () => {
    //     const input = new StringArray([
    //         'The first floor contains a thulium generator, a thulium-compatible microchip, a plutonium generator, and a strontium generator.',
    //         'The second floor contains a plutonium-compatible microchip and a strontium-compatible microchip.',
    //         'The third floor contains a promethium generator, a promethium-compatible microchip, a ruthenium generator, and a ruthenium-compatible microchip.',
    //         'The fourth floor contains nothing relevant.',
    //     ]);
    //     const solution = await new Solution201611b(input).solve();
    //     expect(solution).to.equal('55');
    // }).timeout(5 * 60 * 60 * 1000); // 5 hours
});
