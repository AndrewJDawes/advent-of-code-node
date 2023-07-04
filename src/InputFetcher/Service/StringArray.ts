import Iterator from "../Interface/Iterator.js";
import Service from "../Interface/Service.js";
import StringArrayIterator from "../Iterator/StringArrayIterator.js";

class StringArray implements Service {
    array: Array<string>;
    constructor(array: Array<string>) {
        this.array = array;
    }
    getIterator(): Promise<Iterator> {
        return Promise.resolve(new StringArrayIterator(this.array));
    }
}

export default StringArray;
