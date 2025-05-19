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

####..##...##..###...##..###..#..#.#...#.##...##..
#....#..#.#..#.#..#.#..#.#..#.#..#.#...##..#.#..#.
###..#..#.#..#.#..#.#....#..#.####..#.#.#..#.#..#.
#....#..#.####.###..#.##.###..#..#...#..####.#..#.
#....#..#.#..#.#.#..#..#.#....#..#...#..#..#.#..#.
####..##..#..#.#..#..###.#....#..#...#..#..#..##..

#...#
#...#
.#.#.
..#..
..#..
..#..

*/
interface CharacterTranslation {
    from: string;
    to: string;
}

export const knownLetters: CharacterTranslation[] = [
    // A  (already in your list)
    {
        // prettier-ignore
        from: [
        '.##..',
        '#..#.',
        '#..#.',
        '####.',
        '#..#.',
        '#..#.',
      ].join('\n'),
        to: 'A',
    },

    // B
    {
        // prettier-ignore
        from: [
        '###..',
        '#..#.',
        '#..#.',
        '###..',
        '#..#.',
        '###..',
      ].join('\n'),
        to: 'B',
    },

    // C
    {
        // prettier-ignore
        from: [
        '.###.',
        '#...#',
        '#....',
        '#....',
        '#...#',
        '.###.',
      ].join('\n'),
        to: 'C',
    },

    // D
    {
        // prettier-ignore
        from: [
        '###..',
        '#..#.',
        '#..#.',
        '#..#.',
        '#..#.',
        '###..',
      ].join('\n'),
        to: 'D',
    },

    // E  (already in your list)
    {
        // prettier-ignore
        from: [
        '####.',
        '#....',
        '###..',
        '#....',
        '#....',
        '####.',
      ].join('\n'),
        to: 'E',
    },

    // F
    {
        // prettier-ignore
        from: [
        '####.',
        '#....',
        '###..',
        '#....',
        '#....',
        '#....',
        ].join('\n'),
        to: 'F',
    },

    // G (you already have this one – shown here just for completeness)
    {
        // prettier-ignore

        from: [
        '.##..',
        '#..#.',
        '#....',
        '#.##.',
        '#..#.',
        '.###.',
        ].join('\n'),
        to: 'G',
    },

    // H (already supplied)
    {
        // prettier-ignore

        from: [
            '#..#.',
            '#..#.',
            '####.',
            '#..#.',
            '#..#.',
            '#..#.',
          ].join('\n'),
        to: 'H',
    },

    // I
    {
        from: ['.###.', '..#..', '..#..', '..#..', '..#..', '.###.'].join('\n'),
        to: 'I',
    },

    // J
    {
        // prettier-ignore

        from: [
            '..###',
            '...#.',
            '...#.',
            '...#.',
            '#..#.',
            '.##..',
          ].join('\n'),
        to: 'J',
    },

    // K
    {
        // prettier-ignore

        from: [
            '#..#.',
            '#.#..',
            '##...',
            '#.#..',
            '#.#..',
            '#..#.',
          ].join('\n'),
        to: 'K',
    },

    // L
    {
        // prettier-ignore

        from: [
            '#....',
            '#....',
            '#....',
            '#....',
            '#....',
            '####.',
          ].join('\n'),
        to: 'L',
    },
    // M
    {
        // prettier-ignore

        from: [
            '#...#',
            '##.##',
            '#.#.#',
            '#...#',
            '#...#',
            '#...#',
          ].join('\n'),
        to: 'M',
    },

    // N
    {
        // prettier-ignore

        from: [
            '#...#',
            '##..#',
            '#.#.#',
            '#..##',
            '#...#',
            '#...#',
          ].join('\n'),
        to: 'N',
    },

    // O  (already in your list)
    {
        // prettier-ignore

        from: [
            '.##..',
            '#..#.',
            '#..#.',
            '#..#.',
            '#..#.',
            '.##..',
          ].join('\n'),
        to: 'O',
    },

    // P  (already in your list)
    {
        // prettier-ignore

        from: [
            '###..',
            '#..#.',
            '#..#.',
            '###..',
            '#....',
            '#....',
          ].join('\n'),
        to: 'P',
    },

    // Q
    {
        // prettier-ignore

        from: [
            '.##..',
            '#..#.',
            '#..#.',
            '#..#.',
            '#.#..',
            '.#.#.',
          ].join('\n'),
        to: 'Q',
    },

    // R  (already in your list)
    {
        // prettier-ignore

        from: [
            '###..',
            '#..#.',
            '#..#.',
            '###..',
            '#.#..',
            '#..#.',
          ].join('\n'),
        to: 'R',
    },
    // S
    {
        // prettier-ignore

        from: [
            '.###.',
            '#....',
            '.##..',
            '...#.',
            '#...#',
            '.###.',
          ].join('\n'),
        to: 'S',
    },

    // T
    {
        // prettier-ignore

        from: [
            '#####',
            '..#..',
            '..#..',
            '..#..',
            '..#..',
            '..#..',
          ].join('\n'),
        to: 'T',
    },

    // U
    {
        // prettier-ignore

        from: [
            '#..#.',
            '#..#.',
            '#..#.',
            '#..#.',
            '#..#.',
            '.##..',
          ].join('\n'),
        to: 'U',
    },

    // V
    {
        // prettier-ignore

        from: [
            '#...#',
            '#...#',
            '#...#',
            '#...#',
            '.#.#.',
            '..#..',
          ].join('\n'),
        to: 'V',
    },

    // W
    {
        // prettier-ignore

        from: [
            '#...#',
            '#...#',
            '#.#.#',
            '#.#.#',
            '##.##',
            '#...#',
          ].join('\n'),
        to: 'W',
    },

    // X
    {
        // prettier-ignore

        from: [
            '#...#',
            '.#.#.',
            '..#..',
            '..#..',
            '.#.#.',
            '#...#',
          ].join('\n'),
        to: 'X',
    },

    // Y  (already in your list)
    {
        // prettier-ignore

        from: [
            '#...#',
            '#...#',
            '.#.#.',
            '..#..',
            '..#..',
            '..#..',
          ].join('\n'),
        to: 'Y',
    },

    // Z
    {
        // prettier-ignore

        from: [
            '#####',
            '...#.',
            '..#..',
            '.#...',
            '#....',
            '#####',
          ].join('\n'),
        to: 'Z',
    },
];

export default class Display<T, B> implements DisplayInterface<T, B> {
    private pixelMap: PixelMap<T, B>;
    private characterWidth: number;
    private characterHeight: number;
    private dictionary: CharacterTranslation[];
    constructor(props: {
        pixelMap: PixelMap<T, B>;
        characterWidth: number;
        characterHeight: number;
        dictionary: CharacterTranslation[];
    }) {
        this.pixelMap = props.pixelMap;
        this.characterWidth = props.characterWidth;
        this.characterHeight = props.characterHeight;
        this.dictionary = props.dictionary;
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
        for (let i = 0; i < this.getTotalCharactersCount(); i++) {
            chars.push(this.getCharacter(i, printChar, printBlankChar));
        }
        return chars
            .map((char) => char.map((row) => row.join('')).join('\n'))
            .map((char) => {
                const index = this.dictionary.findIndex(
                    (translation) => translation.from === char
                );
                if (-1 === index) {
                    throw new Error(
                        `Unable to find character ${char} in dictionary`
                    );
                }
                return this.dictionary[index].to;
            })
            .join('');
    }
}
