import Mocha from 'mocha';
import { expect } from 'chai';
import Service from './FilePath.js';
import FileStreamer from '../Streamable/FileStreamer.js';
import TextStreamer from '../Streamable/TextStreamer.js';
import LineStreamer from '../Streamable/LineStreamer.js';

import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ReadStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('InputFetcher FilePath', () => {
    describe('getIterator', () => {
        // it('returns a Promise that resolves to an Iterator', async () => {
        //     const expected = ['one', 'two', 'three'];
        //     const service = new Service(
        //         `${__dirname}/../../../data/test/InputFetcher/Service/FilePath.txt`
        //     );
        //     const iterator = await service.getIterator();
        //     console.log({ iterator });
        //     // expect iterator to have a Symbol.asyncIterator property
        //     expect(iterator[Symbol.asyncIterator]).to.be.a('function');
        //     let index = 0;
        //     for await (const value of iterator) {
        //         // expect(value).to.equal(expected);
        //         index++;
        //     }
        // });
        it('returns a Promise that resolves to an Iterator', async () => {
            const filePath = `${__dirname}/../../../data/test/InputFetcher/Service/FilePath.txt`;
            // const service = new Service(filePath);
            const streamer = new LineStreamer(
                new TextStreamer(
                    new FileStreamer(filePath).getReadableStream()
                ).getReadableStream()
            );
            // for await (const value of streamer) {
            //     console.log({ value });
            // }
            const reader = streamer.getReadableStream().getReader();
            // @todo - implement this as an async iterator (over ReadableStream)
            reader.read().then(function process({ done, value }) {
                // console.log({ done, value });
                if (done) {
                    console.log('Stream complete');
                    return;
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/getReader
                reader.read().then(process);
            });
            // const stream = service.testReadFile();
            // // does not work but should
            // // for await (const chunk of stream) {
            // //     console.log({ chunk });
            // // }
            // const reader = stream.getReader();
            // const decoder = new TextDecoder();
            // let chunks: Array<string> = [];
            // reader.read().then(function processText({ done, value }) {
            //     console.log({ done, value });
            //     const chunk = decoder.decode(value, { stream: true });
            //     console.log({ chunk });
            //     chunks.push(chunk);
            //     if (done) {
            //         console.log('Stream complete');
            //         const chunksJoined = chunks.join('');
            //         console.log({ chunksJoined });
            //         return;
            //     }
            //     // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/getReader
            //     reader.read().then(processText);
            // });
        });
    });
});
