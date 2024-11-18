import Streamer from '../Interface/Streamer.js';

class FileStreamer implements Streamer {
    stream: ReadableStream;
    constructor(stream: ReadableStream) {
        this.stream = stream;
    }
    async getReadableStream(): Promise<ReadableStream<any>> {
        const reader = this.stream.getReader();
        return new ReadableStream({
            start: (controller) => {
                // console.log('start');
                let chunks: Array<string> = [];
                reader.read().then(function process({ done, value: chunk }) {
                    if (done) {
                        if (chunks.length) {
                            controller.enqueue(chunks.join(''));
                        }
                        // console.log('done from LineStreamer');
                        return controller.close();
                    }
                    // console.log('chunk', chunk);
                    chunks.push(chunk);
                    const chunksJoined = chunks.join('');
                    const lines = chunksJoined.split('\n');
                    chunks = [lines.pop() || ''];
                    for (const line of lines) {
                        controller.enqueue(line);
                    }
                    reader.read().then(process);
                });
            },
        });
    }
}

export default FileStreamer;
