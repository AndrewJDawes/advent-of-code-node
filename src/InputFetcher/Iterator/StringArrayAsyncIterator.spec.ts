import Mocha from 'mocha';
import { expect } from 'chai';
import StringArrayAsyncIterator from './StringArrayAsyncIterator.js';

describe('InputFetcher StringArrayIterator', () => {
    it('returns each and every item in the given array', async () => {
        const arr = ['one', 'two', 'three'];
        let index = 0;
        for await (const item of new StringArrayAsyncIterator(arr)) {
            expect(item).to.equal(arr[index]);
            index++;
        }
    });
});
