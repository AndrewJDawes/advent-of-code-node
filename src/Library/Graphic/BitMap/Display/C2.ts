import { PixelMap, Display as DisplayInterface } from '../Interfaces.js';
/*
TODO
- Accept Pixel Map as input
- Accept letter width as input
- Accept letter height as input
- Accept a "dictionary" of 2 dimensional letter arrays mapped to their corresponding characters
- Accept a character to use for "unknown"
- Build a 2 dimensional array per letter
- Compare each element in that 2 dimensional array to the dictionary to translate

-####..##...##..###...##..###..#..#.#...#.##...##..
-#....#..#.#..#.#..#.#..#.#..#.#..#.#...##..#.#..#.
-###..#..#.#..#.#..#.#....#..#.####..#.#.#..#.#..#.
-#....#..#.####.###..#.##.###..#..#...#..####.#..#.
-#....#..#.#..#.#.#..#..#.#....#..#...#..#..#.#..#.
-####..##..#..#.#..#..###.#....#..#...#..#..#..##..

*/
export default class Display<T, B> implements DisplayInterface<T, B> {
    private pixelMap: PixelMap<T, B>;
    constructor(pixelMap: PixelMap<T, B>) {
        this.pixelMap = pixelMap;
    }
    print(printChar: string, printBlankChar: string) {
        let chars: string[][] = [];
        for (let y = 0; y < this.pixelMap.getHeight(); y++) {
            const row = [];
            for (let x = 0; x < this.pixelMap.getWidth(); x++) {
                const char = this.pixelMap.get(x, y);
                row.push(
                    char === this.pixelMap.getBlank()
                        ? printBlankChar
                        : printChar
                );
            }
            chars.push(row);
        }
        return chars.map((row) => row.join('')).join('\n');
    }
}
