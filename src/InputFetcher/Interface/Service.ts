import Iterator from "../Interface/Iterator.js";
interface InputFetcher {
    getReadableStream(): Promise<ReadableStream>;
    getIterator(): Promise<Iterator>;
}

export default InputFetcher;
