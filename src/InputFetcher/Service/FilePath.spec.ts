import Mocha from 'mocha';
import { expect } from 'chai';
import Service from './FilePath.js';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('InputFetcher FilePath', () => {
    describe('getIterator', () => {
        it('returns a Promise that resolves to an Iterator', async () => {
            const expected = ['one', 'two', 'three'];
            const service = new Service(
                `${__dirname}/../../../data/test/InputFetcher/Service/FilePath.txt`
            );
            const iterator = await service.getIterator();
            console.log({ iterator });
            // expect iterator to have a Symbol.asyncIterator property
            expect(iterator[Symbol.asyncIterator]).to.be.a('function');
            let index = 0;
            for await (const value of iterator) {
                expect(value).to.equal(expected);
                index++;
            }
        });
    });
});
