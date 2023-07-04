import Iterator from "../Interface/Iterator.js";
interface InputFetcher {
    getIterator(): Promise<Iterator>;
}

export default InputFetcher;
