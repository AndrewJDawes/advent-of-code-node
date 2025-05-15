import { PixelMap, Display as DisplayInterface } from '../Interfaces.js';
export default class Display<T, B> implements DisplayInterface<T, B> {
    private pixelatedDisplay: PixelMap<T, B>;
    constructor(pixelatedDisplay: PixelMap<T, B>) {
        this.pixelatedDisplay = pixelatedDisplay;
    }
    print(printChar: string, printBlankChar: string) {
        let chars: string[][] = [];
        for (let y = 0; y < this.pixelatedDisplay.getHeight(); y++) {
            const row = [];
            for (let x = 0; x < this.pixelatedDisplay.getWidth(); x++) {
                const char = this.pixelatedDisplay.get(x, y);
                row.push(
                    char === this.pixelatedDisplay.getBlank()
                        ? printBlankChar
                        : printChar
                );
            }
            chars.push(row);
        }
        return chars.map((row) => row.join('')).join('\n');
    }
}
