import { expect } from 'chai';
import {
    countCharacterOccurrences,
    decode,
    parseRoomInputParts,
    rotateLetterCaseInsensitive,
    sanitizeRoom,
    sortCharNumberMapDesc,
} from './Common.js';
describe('Solution20164 Common', () => {
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
    describe('rotateLetterCaseInsensitive', () => {
        it('rotates "a" + 5 to "f"', () => {
            expect(rotateLetterCaseInsensitive('a', 5)).to.equal('f');
        });
        it('rotates "A" + 5 to "F"', () => {
            expect(rotateLetterCaseInsensitive('A', 5)).to.equal('F');
        });
        it('rotates "a" - 1 to "z"', () => {
            expect(rotateLetterCaseInsensitive('a', -1)).to.equal('z');
        });
        it('rotates "a" - 5 to "v"', () => {
            expect(rotateLetterCaseInsensitive('a', -5)).to.equal('v');
        });
        it('rotates "A" - 5 to "V"', () => {
            expect(rotateLetterCaseInsensitive('A', -5)).to.equal('V');
        });
        it('rotates "a" + 27 to "b"', () => {
            expect(rotateLetterCaseInsensitive('a', 27)).to.equal('b');
        });
        it('rotates "b" - 27 to "a"', () => {
            expect(rotateLetterCaseInsensitive('b', -27)).to.equal('a');
        });
        it('rotates "b" - 53 to "a"', () => {
            expect(rotateLetterCaseInsensitive('b', -53)).to.equal('a');
        });
    });
    describe('decode', () => {
        it('interprets bkwzkqsxq-tovvilokx-nozvyiwoxd with sector 172 as rampaging jellybean deployment', () => {
            expect(decode('bkwzkqsxq-tovvilokx-nozvyiwoxd', 172)).to.equal(
                'rampaging jellybean deployment'
            );
        });
        it('interprets wifilzof-wbiwifuny-yhachyylcha with sector 526 as colorful chocolate engineering', () => {
            expect(decode('wifilzof-wbiwifuny-yhachyylcha', 526)).to.equal(
                'colorful chocolate engineering'
            );
        });
    });
});
