import Iterator from "../Interface/Iterator.js";
interface Service {
    getIterator(): Promise<Iterator>;
}

export default Service;
