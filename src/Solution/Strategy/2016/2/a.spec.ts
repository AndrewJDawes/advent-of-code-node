import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20162a from './a.js';
describe('Solution20162a', () => {
    describe('solve', () => {
        it('interprets ULL\nRRDDD\nLURDL\nUUUUD as 1985', async () => {
            const input = new StringArray(['ULL', 'RRDDD', 'LURDL', 'UUUUD']);
            expect(await new Solution20162a(input).solve()).to.equal('1985');
        });
    });
});
