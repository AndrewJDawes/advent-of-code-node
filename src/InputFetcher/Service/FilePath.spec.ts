import { expect } from 'chai';
import Service from './FilePath.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('InputFetcher FilePath', () => {
    describe('getAsyncIterator', () => {
        it('returns a Promise that resolves to an Iterator', async () => {
            const filePath = `${__dirname}/../../../data/test/InputFetcher/Service/FilePath.txt`;
            const service = new Service(filePath);
            const iterator = await service.getAsyncIterator();
            // expect iterator to have a Symbol.asyncIterator property
            expect(iterator[Symbol.asyncIterator]).to.be.a('function');
        });
        it('returns an async iterator where number of items is equal to number of lines in file', async () => {
            const filePath = `${__dirname}/../../../data/test/InputFetcher/Service/FilePath.txt`;
            const service = new Service(filePath);
            const iterator = await service.getAsyncIterator();
            let totalLines = 0;
            for await (const value of iterator) {
                totalLines++;
            }
            expect(totalLines).to.equal(129871);
        });
    });
});
