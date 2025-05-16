import { PixelMap, Count as CountInterface } from '../Interfaces.js';

export default class Count<T, B> implements CountInterface<T, B> {
    private pixelMap: PixelMap<T, B>;
    constructor(pixelMap: PixelMap<T, B>) {
        this.pixelMap = pixelMap;
    }
    count() {
        let count = 0;
        for (let x = 0; x < this.pixelMap.getWidth(); x++) {
            for (let y = 0; y < this.pixelMap.getHeight(); y++) {
                const char = this.pixelMap.get(x, y);
                if (char !== this.pixelMap.getBlank()) {
                    count++;
                }
            }
        }
        return count;
    }
}
