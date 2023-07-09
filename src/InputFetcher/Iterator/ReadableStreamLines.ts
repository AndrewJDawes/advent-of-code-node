import readline from 'readline';
import Iterator from '../Interface/Iterator.js';

class ReadableStreamLines implements Iterator {
    readStream: ReadableStream;
    constructor(readStream: ReadableStream) {
        this.readStream = readStream;
    }
    [Symbol.asyncIterator](): {
        next(): Promise<{ value: string; done: boolean }>;
    } {
        const reader = this.readStream.getReader();
        console.log({ reader });
        return {
            next: () => {
                return new Promise((resolve, reject) => {
                    console.log('next');
                    reader.read().then(({ done, value }) => {
                        console.log({ done, value });
                        if (done) {
                            reader.releaseLock();
                            resolve({ value: '', done: true });
                        } else {
                            resolve({ value: value, done: false });
                        }
                    });
                });
            },
        };
    }
}

export default ReadableStreamLines;
