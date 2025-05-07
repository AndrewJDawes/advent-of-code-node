import { expect } from 'chai';
import {
    AutonomousBridgeBypassAnnotationCounter,
    ProtocolValidatorSSL,
} from './common.js';
describe('AutonomousBridgeBypassAnnotationCounter', () => {
    it('interprets abba[mnop]qrst as 1 outside and 0 inside', () => {
        const input = 'abba[mnop]qrst';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(1);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
    it('interprets abba[mnop]qrst as supports ABBA protocol,', () => {
        const input = 'abba[mnop]qrst';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.supportsABBAProtocol()).to.equal(true);
    });
    it('interprets abcd[bddb]xyyx as 1 outside and 1 inside', () => {
        const input = 'abcd[bddb]xyyx';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(1);
        expect(counter.getInsideHypernetCount()).to.equal(1);
    });
    it('interprets abcd[bddb]xyyx as does not support ABBA protocol', () => {
        const input = 'abcd[bddb]xyyx';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.supportsABBAProtocol()).to.equal(false);
    });
    it('interprets aaaaa[qwer]tyui as 0 outside and 0 inside', () => {
        const input = 'aaaaa[qwer]tyui';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(0);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
    it('interprets ioxxoj[asdfgh]zxcvbn as 1 outside and 0 inside', () => {
        const input = 'ioxxoj[asdfgh]zxcvbn';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(1);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
    it('interprets ioxxoj[asdfgh]zxcvbnnbsfs as 2 outside and 0 inside', () => {
        const input = 'ioxxoj[asdfgh]zxcvbnnbsfs';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(2);
        expect(counter.getInsideHypernetCount()).to.equal(0);
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
