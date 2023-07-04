interface Iterator {
    [Symbol.asyncIterator](): {
        next(): Promise<{ value: string; done: boolean }>;
    };
}

export default Iterator;
