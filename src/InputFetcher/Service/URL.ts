import InputFetcherInterfaceService from '../Interface/Service.js';
import ReadableStreamAsyncIterator from '../Iterator/ReadableStreamAsyncIterator.js';
import AsyncIterator from '../Interface/AsyncIterator.js';
import URLStreamer from '../Streamable/URLStreamer.js';
import LineStreamer from '../Streamable/LineStreamer.js';
import TextStreamer from '../Streamable/TextStreamer.js';
class URL implements InputFetcherInterfaceService {
    url: string;
    constructor(url: string) {
        this.url = url;
    }
    async getAsyncIterator(): Promise<AsyncIterator> {
        // Call with Cookie: session: asdfasdfadsf
        const urlStreamer = await new URLStreamer(this.url, {
            headers: {
                cookie: `session=${process.env.ADVENT_OF_CODE_COOKIE_SESSION}`,
            },
        }).getReadableStream();
        const textStreamer = await new TextStreamer(
            urlStreamer
        ).getReadableStream();
        // TODO: Figure out why this is not working - the textStreamer works fine, but this is always returning an empty string
        const lineStreamer = await new LineStreamer(
            textStreamer
        ).getReadableStream();
        // const iterator = new ReadableStreamAsyncIterator(urlStreamer);
        // const iterator = new ReadableStreamAsyncIterator(textStreamer);
        const iterator = new ReadableStreamAsyncIterator(lineStreamer);
        return iterator;
    }
}
export default URL;
