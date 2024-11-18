import InputFetcherInterfaceService from '../Interface/Service.js';
import ReadableStreamAsyncIterator from '../Iterator/ReadableStreamAsyncIterator.js';
import AsyncIterator from '../Interface/AsyncIterator.js';
import LineStreamer from '../Streamable/LineStreamer.js';
import TextStreamer from '../Streamable/TextStreamer.js';
import FileStreamer from '../Streamable/FileStreamer.js';
class FilePath implements InputFetcherInterfaceService {
    filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    async getAsyncIterator(): Promise<AsyncIterator> {
        const fileStreamer = await new FileStreamer(
            this.filePath
        ).getReadableStream();
        const textStreamer = await new TextStreamer(
            fileStreamer
        ).getReadableStream();
        const lineStreamer = await new LineStreamer(
            textStreamer
        ).getReadableStream();
        const iterator = new ReadableStreamAsyncIterator(lineStreamer);
        return iterator;
    }
}
export default FilePath;
