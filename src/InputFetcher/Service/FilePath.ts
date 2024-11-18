import InputFetcherInterfaceService from '../Interface/Service.js';
import fs, { read } from 'fs';
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
        const streamer = new LineStreamer(
            new TextStreamer(
                new FileStreamer(this.filePath).getReadableStream()
            ).getReadableStream()
        );
        const iterator = new ReadableStreamAsyncIterator(
            streamer.getReadableStream()
        );
        return iterator;
    }
}
export default FilePath;
