import { PixelMap, Count as CountInterface } from '../Interfaces.js';

export default class Count<T, B> implements CountInterface<T, B> {
    private pixelatedDisplay: PixelMap<T, B>;
    constructor(pixelatedDisplay: PixelMap<T, B>) {
        this.pixelatedDisplay = pixelatedDisplay;
    }
    count() {
        let count = 0;
        for (let x = 0; x < this.pixelatedDisplay.getWidth(); x++) {
            for (let y = 0; y < this.pixelatedDisplay.getHeight(); y++) {
                const char = this.pixelatedDisplay.get(x, y);
                if (char !== this.pixelatedDisplay.getBlank()) {
                    count++;
                }
            }
        }
        return count;
    }
}
