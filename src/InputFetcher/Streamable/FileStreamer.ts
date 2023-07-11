import Streamable from '../Interface/Streamable.js';
import fs from 'fs';

class FileStreamer implements Streamable {
    filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    getReadableStream(): ReadableStream<any> {
        const reader = fs.createReadStream(this.filePath);
        return new ReadableStream({
            start(controller) {
                reader.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });
                reader.on('end', () => {
                    controller.close();
                });
            },
        });
    }
}

export default FileStreamer;
