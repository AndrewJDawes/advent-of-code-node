import { OutOfBoundsException } from '../Exceptions.js';
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
interface CharacterTranslation {
    from: string;
    to: string;
}
const knownLetters: CharacterTranslation[] = [
    {
        from: `####.
        #....
        ###..
        #....
        #....
        ####.`,
        to: 'E',
    },
];

export default class Display<T, B> implements DisplayInterface<T, B> {
    private pixelMap: PixelMap<T, B>;
    private characterWidth: number;
    private characterHeight: number;
    constructor(
        pixelMap: PixelMap<T, B>,
        characterWidth: number,
        characterHeight: number
    ) {
        this.pixelMap = pixelMap;
        this.characterWidth = characterWidth;
        this.characterHeight = characterHeight;
    }
    public getCharacterStartAndEndIndexes(characterIndex: number) {
        const charsPerRow = this.getCharactersPerRowCount();
        const xStart = (characterIndex % charsPerRow) * this.characterWidth;
        const xEnd = xStart + this.characterWidth;
        const yStart =
            Math.floor(characterIndex / charsPerRow) * this.characterHeight;
        const yEnd = yStart + this.characterHeight;
        return {
            xStart,
            xEnd,
            yStart,
            yEnd,
        };
    }
    public getCharactersPerRowCount() {
        return Math.floor(this.pixelMap.getWidth() / this.characterWidth);
    }
    public getTotalRowsCount() {
        return Math.floor(this.pixelMap.getHeight() / this.characterHeight);
    }
    public getTotalCharactersCount() {
        return this.getTotalRowsCount() * this.getCharactersPerRowCount();
    }
    public getCharacter(
        characterIndex: number,
        printChar: string,
        printBlankChar: string
    ) {
        const { xStart, xEnd, yStart, yEnd } =
            this.getCharacterStartAndEndIndexes(characterIndex);
        if (xEnd > this.pixelMap.getWidth()) {
            throw new OutOfBoundsException(
                `xEnd is greater than pixel map width. xEnd: ${xEnd}. pixel map width: ${this.pixelMap.getWidth()}`
            );
        }
        if (yEnd > this.pixelMap.getHeight()) {
            throw new OutOfBoundsException(
                `yEnd is greater than pixel map height. yEnd: ${yEnd}. pixel map height: ${this.pixelMap.getHeight()}`
            );
        }
        let chars: string[][] = [];
        for (let y = yStart; y < yEnd; y++) {
            const row = [];
            for (let x = xStart; x < xEnd; x++) {
                const char = this.pixelMap.get(x, y);
                row.push(
                    char === this.pixelMap.getBlank()
                        ? printBlankChar
                        : printChar
                );
            }
            chars.push(row);
        }
        return chars;
    }
    print(printChar: string, printBlankChar: string) {
        let chars: string[][][] = [];
        for (let i = 0; i < this.getTotalRowsCount(); i++) {
            chars.push(this.getCharacter(i, printChar, printBlankChar));
        }
        return chars.map((row) => row.join('')).join('\n');
    }
}
