import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution201611b from './b.js';
const input = new StringArray([
    'The first floor contains a thulium generator, a thulium-compatible microchip, a plutonium generator, and a strontium generator.',
    'The second floor contains a plutonium-compatible microchip and a strontium-compatible microchip.',
    'The third floor contains a promethium generator, a promethium-compatible microchip, a ruthenium generator, and a ruthenium-compatible microchip.',
    'The fourth floor contains nothing relevant.',
]);
const solution = await new Solution201611b(input).solve();
