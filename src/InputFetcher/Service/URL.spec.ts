import { expect } from 'chai';
import Service from './URL.js';

describe('InputFetcher URL', () => {
    describe('getAsyncIterator', () => {
        it('returns a Promise that resolves to an Iterator', async () => {
            const url = 'https://adventofcode.com/2015/day/1/input';
            const service = new Service(url);
            const iterator = await service.getAsyncIterator();
            // expect iterator to have a Symbol.asyncIterator property
            expect(iterator[Symbol.asyncIterator]).to.be.a('function');
        });
        it('returns an async iterator where number of items is equal to number of lines in file', async () => {
            const url = 'https://adventofcode.com/2015/day/1/input';
            const service = new Service(url);
            const iterator = await service.getAsyncIterator();
            let totalLines = 1;
            let endValue = '';
            for await (const value of iterator) {
                console.log({ value });
                endValue += value;
                totalLines++;
            }
            console.log({ endValue });
            expect(endValue).to.equal('');
            expect(totalLines).to.equal(129871);
        });
    });
});
