import { expect } from 'chai';
import { sideLengthsAreValid } from './Common';
describe('sideLengthsAreValid', () => {
    it('interprets [6,7,8] as true', () => {
        expect(sideLengthsAreValid([6, 7, 8])).to.be.true;
    });
    it('interprets [2,900,3] to be false', () => {
        expect(sideLengthsAreValid([2, 900, 3])).to.be.false;
    });
});
