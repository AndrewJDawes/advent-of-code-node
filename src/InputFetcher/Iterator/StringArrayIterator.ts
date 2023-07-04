import Iterator from "../Interface/Iterator.js";

class StringArrayIterator implements Iterator {
    array: Array<string>;
    constructor(array: Array<string>) {
        // Copy the array to prevent mutation
        this.array = [...array];
    }
    [Symbol.asyncIterator](): {
        next(): Promise<{ value: string; done: boolean }>;
    } {
        let index = -1;
        return {
            next: () => {
                index++;
                return Promise.resolve({
                    value: this.array[index] ?? "",
                    done: index < this.array.length ? false : true,
                });
            },
        };
    }
}

export default StringArrayIterator;
