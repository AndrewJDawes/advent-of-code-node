interface AsyncIterator {
    [Symbol.asyncIterator](): {
        next(): Promise<{ value: string; done: boolean }>;
    };
}

export default AsyncIterator;
