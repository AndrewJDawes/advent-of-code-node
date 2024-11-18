import Streamer from '../Interface/Streamer.js';

class URLStreamer implements Streamer {
    url: string;
    options: RequestInit;
    constructor(url: string, options: RequestInit) {
        this.url = url;
        this.options = options;
    }
    async getReadableStream(): Promise<ReadableStream<any>> {
        return fetch(this.url, this.options).then((response) => {
            if (!response.body) {
                throw new Error(
                    'ReadableStream not yet supported in this browser.'
                );
            }
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    return pump();
                    function pump(): any {
                        return reader.read().then(({ done, value }) => {
                            // When no more data needs to be consumed, close the stream
                            if (done) {
                                controller.close();
                                return;
                            }
                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                },
            });
        });
    }
}

export default URLStreamer;
