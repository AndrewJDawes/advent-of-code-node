import InputFetcherInterfaceService from '../Interface/Service.js';
import fs, { read } from 'fs';
import ReadableStreamLines from '../Iterator/ReadableStreamLines.js';
import Iterator from '../Interface/Iterator.js';
class FilePath implements InputFetcherInterfaceService {
    filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    async getReadableStream(): Promise<ReadableStream> {
        const reader = fs.createReadStream(this.filePath);
        return new ReadableStream({
            async start(controller) {
                console.log('start');
                const decoder = new TextDecoder();
                let chunks: Array<string> = [];
                async function read() {
                    console.log('read');
                    console.log({ reader });
                    console.log({ readerIsPaused: reader.isPaused() });
                    const { done, value } = await reader.read();
                    console.log({ done, value });
                    if (done) {
                        console.log('done');
                        return controller.close();
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    console.log('chunk', chunk);
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
    async getIterator(): Promise<Iterator> {
        return new ReadableStreamLines(await this.getReadableStream());
    }
}
export default FilePath;
