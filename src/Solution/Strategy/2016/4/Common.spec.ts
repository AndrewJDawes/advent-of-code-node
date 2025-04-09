import { expect } from 'chai';
import {
    countCharacterOccurrences,
    parseRoomInputParts,
    sanitizeRoom,
    sortCharNumberMapDesc,
} from './Common.js';
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
describe('sanitizeRoom', () => {
    it('strips dashes', () => {
        expect(sanitizeRoom('vhehkyne-unggr-inkvatlbgz')).to.equal(
            'vhehkyneunggrinkvatlbgz'
        );
    });
});
describe('countCharacterOccurrences', () => {
    it('counts occurrences of characters', () => {
        const result = countCharacterOccurrences('aaaaa-bbb-z-y-x');
        expect(result.get('a')).to.equal(5);
        expect(result.get('b')).to.equal(3);
        expect(result.get('x')).to.equal(1);
        expect(result.get('y')).to.equal(1);
        expect(result.get('z')).to.equal(1);
    });
});
describe('sortCharNumberMapDesc', () => {
    it('sorts a map of string keys and number values into sorted array of tuples', () => {
        expect(
            sortCharNumberMapDesc(
                new Map(
                    Object.entries({
                        a: 5,
                        b: 3,
                        z: 1,
                        y: 1,
                        x: 1,
                    })
                )
            )
        ).to.eql([
            ['a', 5],
            ['b', 3],
            ['x', 1],
            ['y', 1],
            ['z', 1],
        ]);
    });
});
