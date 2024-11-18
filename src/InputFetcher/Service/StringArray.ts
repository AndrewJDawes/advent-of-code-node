import AsyncIterator from '../Interface/AsyncIterator.js';
import Service from '../Interface/Service.js';
import StringArrayAsyncIterator from '../Iterator/StringArrayAsyncIterator.js';

class StringArray implements Service {
    array: Array<string>;
    constructor(array: Array<string>) {
        this.array = array;
    }
    getAsyncIterator(): Promise<AsyncIterator> {
        return Promise.resolve(new StringArrayAsyncIterator(this.array));
    }
}

export default StringArray;
