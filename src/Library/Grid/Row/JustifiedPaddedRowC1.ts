/*
1. Create a LeftPaddedArray { class that accepts padding and elements (array) and wraps array. Iterator method will not change, but index accessor will. Also, method to see if has item at given index.
2. Create a GridNavigator that accepts LeftPaddedArray {[] and a starting point. Should probs check if starting point is accurate.
3. Change the move() method to check if row number exists based on number of LeftPaddedArray {[]s and to check if column number exists by checking the padding get(). Don't move if not.
*/

import { Row, Justify } from '../Interfaces.js';

class JustifiedPaddedRowC1 implements Row {
    array: string[];
    offset: number;
    constructor(
        array: string[],
        padding: number = 0,
        justify: Justify = Justify.Left
    ) {
        let offset = 0;
        let shouldPad = array.length < padding;
        if (shouldPad) {
            const difference = padding - array.length;
            if ((justify = Justify.Left)) {
                offset = Math.abs(Math.floor(difference / 2));
            } else {
                offset = Math.abs(Math.ceil(difference / 2));
            }
        }
        this.offset = offset;
        this.array = array;
    }
    get(index: number): string | undefined {
        return this.array[index - this.offset];
    }
    set(index: number, value: string): void {
        this.array[index - this.offset] = value;
    }
    has(index: number): boolean {
        return undefined !== this.get(index);
    }
    length() {
        return this.array.length;
    }
    startIndex(): number {
        return this.offset;
    }
    endIndex(): number {
        return this.length() + this.offset - 1;
    }
}

export default JustifiedPaddedRowC1;
