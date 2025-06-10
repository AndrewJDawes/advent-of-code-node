import { expect } from 'chai';
import { ProtocolValidatorTLS, ProtocolValidatorSSL } from './common.js';
describe('ProtocolValidatorTLS', () => {
    it('interprets abba[mnop]qrst as supports TLS', () => {
        const input = 'abba[mnop]qrst';
        const counter = new ProtocolValidatorTLS();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.isValid()).to.equal(true);
    });
    it('interprets abcd[bddb]xyyx as does not support TLS', () => {
        const input = 'abcd[bddb]xyyx';
        const counter = new ProtocolValidatorTLS();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.isValid()).to.equal(false);
    });
    it('interprets aaaaa[qwer]tyui as does not support TLS', () => {
        const input = 'aaaaa[qwer]tyui';
        const counter = new ProtocolValidatorTLS();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.isValid()).to.equal(false);
    });
    it('interprets ioxxoj[asdfgh]zxcvbn as supports TLS', () => {
        const input = 'ioxxoj[asdfgh]zxcvbn';
        const counter = new ProtocolValidatorTLS();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.isValid()).to.equal(true);
    });
    it('interprets ioxxoj[asdfgh]zxcvbnnbsfs as supports TLS', () => {
        const input = 'ioxxoj[asdfgh]zxcvbnnbsfs';
        const counter = new ProtocolValidatorTLS();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.isValid()).to.equal(true);
    });
});
/*

aba[bab]xyz supports SSL (aba outside square brackets with corresponding bab within square brackets).
xyx[xyx]xyx does not support SSL (xyx, but no corresponding yxy).
aaa[kek]eke supports SSL (eke in supernet with corresponding kek in hypernet; the aaa sequence is not related, because the interior character must be different).
zazbz[bzb]cdb supports SSL (zaz has no corresponding aza, but zbz has a corresponding bzb, even though zaz and zbz overlap).
*/
describe('ProtocolValidatorSSL', () => {
    it('interprets aba[bab]xyz as supports SSL', () => {
        const input = 'aba[bab]xyz';
        const validator = new ProtocolValidatorSSL();
        input.split('').forEach((character) => {
            validator.add(character);
        });
        expect(validator.isValid()).to.equal(true);
    });
    it('interprets xyx[xyx]xyx as does not support SSL', () => {
        const input = 'xyx[xyx]xyx';
        const validator = new ProtocolValidatorSSL();
        input.split('').forEach((character) => {
            validator.add(character);
        });
        expect(validator.isValid()).to.equal(false);
    });
    it('interprets aaaa[kek]eke as supports SSL', () => {
        const input = 'aaaa[kek]eke';
        const validator = new ProtocolValidatorSSL();
        input.split('').forEach((character) => {
            validator.add(character);
        });
        expect(validator.isValid()).to.equal(true);
    });
    it('interprets zazbz[bzb]cdb as supports SSL', () => {
        const input = 'zazbz[bzb]cdb';
        const validator = new ProtocolValidatorSSL();
        input.split('').forEach((character) => {
            validator.add(character);
        });
        expect(validator.isValid()).to.equal(true);
    });
});
