import InputFetcherInterfaceService from '../Interface/Service.js';
import ReadableStreamAsyncIterator from '../Iterator/ReadableStreamIterator.js';
import AsyncIterator from '../Interface/Iterator.js';
import readline from 'readline';
class URL implements InputFetcherInterfaceService {
    url: string;
    constructor(url: string) {
        this.url = url;
    }
    async getReadableStream(): Promise<ReadableStream> {
        const res = await fetch(this.url);
        if (null === res.body) {
            throw new Error('res.body is null');
        }
        const reader = res.body.getReader();
        return new ReadableStream({
            async start(controller) {
                const decoder = new TextDecoder();
                let chunks: Array<string> = [];
                async function read() {
                    const { done, value } = await reader.read();
                    if (done) {
                        return controller.close();
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    chunks.push(chunk);
                    const chunksJoined = chunks.join('');
                    const lines = chunksJoined.split('\n');
                    chunks = [lines.pop() || ''];
                    for (const line of lines) {
                        controller.enqueue(line);
                    }
                    return read();
                }
                return read();
            },
        });
    }
    async getAsyncIterator(): Promise<AsyncIterator> {
        return new ReadableStreamAsyncIterator(await this.getReadableStream());
    }
}
export default URL;
