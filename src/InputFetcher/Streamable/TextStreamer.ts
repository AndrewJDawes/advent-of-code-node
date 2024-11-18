import Streamer from '../Interface/Streamer.js';

class TextStreamer implements Streamer {
    stream: ReadableStream;
    constructor(stream: ReadableStream) {
        this.stream = stream;
    }
    async getReadableStream(): Promise<ReadableStream<any>> {
        const reader = this.stream.getReader();
        return new ReadableStream({
            start: (controller) => {
                // console.log('start');
                const decoder = new TextDecoder();
                reader.read().then(function process({ done, value }) {
                    if (done) {
                        // console.log('done from TextStreamer');
                        return controller.close();
                    }
                    controller.enqueue(decoder.decode(value, { stream: true }));
                    reader.read().then(process);
                });
            },
        });
    }
}

export default TextStreamer;
