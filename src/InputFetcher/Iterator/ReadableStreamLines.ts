import readline from "readline";
import Iterator from "../Interface/Iterator.js";

class StreamLines implements Iterator {
    readStream: ReadableStream;
    constructor(readStream: ReadableStream) {
        this.readStream = readStream;
    }
    [Symbol.asyncIterator](): {
        next(): Promise<{ value: string; done: boolean }>;
    } {
        const reader = this.readStream.getReader();
        return {
            next() {
                return new Promise((resolve, reject) => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            reader.releaseLock();
                            resolve({ value: "", done: true });
                        } else {
                            resolve({ value: value, done: false });
                        }
                    });
                });
            },
        };
    }
}

export default StreamLines;
