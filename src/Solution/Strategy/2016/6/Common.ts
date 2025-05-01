export class PositionalFrequencyCounter<T> implements Iterable<Map<T, number>> {
    public mapArr: Map<T, number>[];
    constructor() {
        this.mapArr = [];
    }
    add(index: number, value: T) {
        if (!this.mapArr[index]) {
            this.mapArr[index] = new Map();
        }
        this.mapArr[index].set(value, (this.mapArr[index].get(value) ?? 0) + 1);
    }
    static getMostFrequent<T>(map: Map<T, number>) {
        return [...map.entries()].reduce((a, b) => (a[1] <= b[1] ? b : a))[0];
    }
    static getLeastFrequent<T>(map: Map<T, number>) {
        return [...map.entries()].reduce((a, b) => (a[1] <= b[1] ? a : b))[0];
    }
    [Symbol.iterator](): Iterator<Map<T, number>> {
        let index = 0;
        const arr = this.mapArr;
        return {
            next(): IteratorResult<Map<T, number>> {
                if (index < arr.length) {
                    const value = arr[index++];
                    if (!value)
                        throw new Error(`Missing map at position ${index - 1}`);
                    return { value, done: false };
                }
                return { value: undefined, done: true };
            },
        };
    }
}
