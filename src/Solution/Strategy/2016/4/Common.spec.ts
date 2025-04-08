import { expect } from 'chai';
import { parseRoomInputParts } from './Common.js';
describe('parseRoomInputParts', () => {
    it('throws when checksum too long', () => {
        const line = 'aaaaa-bbb-z-y-x-123[abxyzzz])';
        expect(() => parseRoomInputParts(line)).to.throw(
            `Invalid input: ${line}`
        );
    });
    it('returns parts when input is valid', () => {
        const line = 'aaaaa-bbb-z-y-x-123[abxyz]';
        expect(parseRoomInputParts(line)).to.eql({
            room: 'aaaaa-bbb-z-y-x',
            sector: '123',
            checksum: 'abxyz',
        });
    });
});
