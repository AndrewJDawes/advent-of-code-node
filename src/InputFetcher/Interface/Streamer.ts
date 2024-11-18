interface Streamer {
    getReadableStream(): Promise<ReadableStream>;
}

export default Streamer;
