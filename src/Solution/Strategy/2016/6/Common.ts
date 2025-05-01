export class PositionalFrequencyCounter<T> implements Iterable<Map<T, number>> {
    public mapArr: Map<T, number>[];
    constructor() {
        this.mapArr = [];
    }
    add(index: number, value: T) {
        let map: Map<T, number>;
        const existingMap = this.mapArr[index];
        if (undefined === existingMap) {
            map = new Map();
            this.mapArr[index] = map;
        } else {
            map = existingMap;
        }
        const existingCount = map.get(value);
        if (undefined === existingCount) {
            map.set(value, 0);
        } else {
            map.set(value, existingCount + 1);
        }
    }
    static getMostFrequent<T>(map: Map<T, number>) {
        const sorted = [...map.entries()].sort(
            ([aChar, aCount], [bChar, bCount]) => {
                return aCount - bCount;
            }
        );
        return sorted[sorted.length - 1][0];
    }
    static getLeastFrequent<T>(map: Map<T, number>) {
        const sorted = [...map.entries()].sort(
            ([aChar, aCount], [bChar, bCount]) => {
                return bCount - aCount;
            }
        );
        return sorted[sorted.length - 1][0];
    }
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
