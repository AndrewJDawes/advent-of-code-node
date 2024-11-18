import Mocha from 'mocha';
import { expect } from 'chai';
import Default from '../Factory/Default.js';
describe('InputFetcher Default factory', () => {
    it('returns service with getAsyncIterator method when given a url type', () => {
        const factory = new Default();
        const service = factory.getService('url', 'https://example.com');
        expect(service['getAsyncIterator']).to.be.a('function');
    });
    it('returns service with getAsyncIterator method when given a file type', () => {
        const factory = new Default();
        const service = factory.getService('file', 'https://example.com');
        expect(service['getAsyncIterator']).to.be.a('function');
    });
    it('returns service with getAsyncIterator method when given an array type', () => {
        const factory = new Default();
        const service = factory.getService('array', ['cat', 'dog', 'mouse']);
        expect(service['getAsyncIterator']).to.be.a('function');
    });
});
