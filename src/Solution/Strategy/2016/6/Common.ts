export class PositionalFrequencyCounter<T> implements Iterable<Map<T, number>> {
    public mapArr: Map<T, number>[];
    constructor() {
        this.mapArr = [];
    }
    add(index: number, value: T) {}
    getMostFrequent(index: number) {}
    getLeastFrequent(index: number) {}
    [Symbol.iterator](): Iterator<Map<T, number>, Map<T, number> | undefined> {
        const values = [...this.mapArr];
        let index = -1;
        return {
            next(): IteratorResult<Map<T, number>, Map<T, number> | undefined> {
                index++;
                const done = !(index < values.length - 1);
                const value = index < values.length ? values[index] : undefined;
                if (done) {
                    const result: IteratorReturnResult<
                        Map<T, number> | undefined
                    > = {
                        done: true,
                        value,
                    };
                    return result;
                }
                if (undefined === value) {
                    throw new Error(
                        `Undefined IteratorYieldResult - index: ${index}`
                    );
                }
                const result: IteratorYieldResult<Map<T, number>> = {
                    done: false,
                    value,
                };
                return result;
            },
        };
    }
}
