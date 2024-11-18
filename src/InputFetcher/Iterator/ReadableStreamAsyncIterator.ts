import readline from 'readline';
import AsyncIterator from '../Interface/AsyncIterator.js';

class ReadableStreamAsyncIterator implements AsyncIterator {
    readStream: ReadableStream;
    constructor(readStream: ReadableStream) {
        this.readStream = readStream;
    }
    [Symbol.asyncIterator](): {
        next(): Promise<{ value: string; done: boolean }>;
    } {
        const reader = this.readStream.getReader();
        return {
            next: () => {
                return new Promise((resolve, reject) => {
                    // console.log('next from ReadableStreamIterator');
                    reader
                        .read()
                        .then(({ done, value }) => {
                            // console.log({ done, value });
                            if (done) {
                                reader.releaseLock();
                                resolve({ value: '', done: true });
                            } else {
                                resolve({ value: value, done: false });
                            }
                        })
                        .catch((error) => {
                            console.log({ error });
                            reject(error);
                        });
                });
            },
        };
    }
}

export default ReadableStreamAsyncIterator;
