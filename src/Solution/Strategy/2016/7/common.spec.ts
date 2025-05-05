import { expect } from 'chai';
import { AutonomousBridgeBypassAnnotationCounter } from './common.js';
describe('AutonomousBridgeBypassAnnotationCounter', () => {
    it('interprets abba[mnop]qrst as 1 outside and 0 inside', async () => {
        const input = 'abba[mnop]qrst';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(1);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
    it('interprets abba[mnop]qrst as supports ABBA protocol,', async () => {
        const input = 'abba[mnop]qrst';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.supportsABBAProtocol()).to.equal(true);
    });
    it('interprets abcd[bddb]xyyx as 1 outside and 1 inside', async () => {
        const input = 'abcd[bddb]xyyx';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(1);
        expect(counter.getInsideHypernetCount()).to.equal(1);
    });
    it('interprets abcd[bddb]xyyx as does not support ABBA protocol', async () => {
        const input = 'abcd[bddb]xyyx';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.supportsABBAProtocol()).to.equal(false);
    });
    it('interprets aaaaa[qwer]tyui as 0 outside and 0 inside', async () => {
        const input = 'aaaaa[qwer]tyui';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(0);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
    it('interprets ioxxoj[asdfgh]zxcvbn as 1 outside and 0 inside', async () => {
        const input = 'ioxxoj[asdfgh]zxcvbn';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(1);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
    it('interprets ioxxoj[asdfgh]zxcvbnnbsfs as 2 outside and 0 inside', async () => {
        const input = 'ioxxoj[asdfgh]zxcvbnnbsfs';
        const counter = new AutonomousBridgeBypassAnnotationCounter();
        input.split('').forEach((character) => {
            counter.add(character);
        });
        expect(counter.getOutsideHypernetCount()).to.equal(2);
        expect(counter.getInsideHypernetCount()).to.equal(0);
    });
});
