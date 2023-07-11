import Streamable from '../Interface/Streamable.js';

class TextStreamer implements Streamable {
    stream: ReadableStream;
    constructor(stream: ReadableStream) {
        this.stream = stream;
    }
    getReadableStream(): ReadableStream<any> {
        const reader = this.stream.getReader();
        return new ReadableStream({
            start: (controller) => {
                // console.log('start');
                const decoder = new TextDecoder();
                reader.read().then(function process({ done, value }) {
                    if (done) {
                        // console.log('done');
                        return controller.close();
                    }
                    controller.enqueue(decoder.decode(value, { stream: true }));
                });
            },
        });
    }
}

export default TextStreamer;
