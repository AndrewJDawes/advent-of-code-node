import Streamer from '../Interface/Streamer.js';
import fs from 'fs';

class FileStreamer implements Streamer {
    filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    getReadableStream(): ReadableStream<any> {
        const reader = fs.createReadStream(this.filePath);
        return new ReadableStream({
            start(controller) {
                reader.on('data', (chunk) => {
                    // console.log('data from FileStreamer');
                    controller.enqueue(chunk);
                });
                reader.on('end', () => {
                    console.log('end from FileStreamer');
                    controller.close();
                });
            },
        });
    }
}

export default FileStreamer;
