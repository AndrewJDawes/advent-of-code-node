export class OutOfBoundsException extends Error {
    constructor(message: string) {
        super(message);
    }
}
export class PixelMap<T, B> {
    private width: number;
    private height: number;
    private pixels: Array<Array<T>>;
    private blank: B;
    constructor(width: number, height: number, blank: B) {
        this.width = width;
        this.height = height;
        this.blank = blank;
        this.pixels = new Array(this.width);
    }
    private validateX(x: number) {
        if (x < 0 || x >= this.width) {
            throw new OutOfBoundsException(
                `Invalid X coordinate x: ${x} for object with width: ${this.width}`
            );
        }
    }
    private validateY(y: number) {
        if (y < 0 || y >= this.height) {
            throw new OutOfBoundsException(
                `Invalid Y coordinate y: ${y} for object with height: ${this.height}`
            );
        }
    }
    public getWidth() {
        return this.width;
    }
    public getHeight() {
        return this.height;
    }
    public getBlank() {
        return this.blank;
    }
    public set(x: number, y: number, value: T | B) {
        this.validateX(x);
        this.validateY(y);
        if (!this.pixels.hasOwnProperty(x)) {
            this.pixels[x] = new Array(this.height);
        }
        if (value === this.getBlank()) {
            this.delete(x, y);
            return;
        }
        this.pixels[x][y] = value as T;
    }
    public get(x: number, y: number) {
        this.validateX(x);
        this.validateY(y);
        if (!this.pixels.hasOwnProperty(x)) {
            return this.blank;
        }
        if (!this.pixels[x].hasOwnProperty(y)) {
            return this.blank;
        }
        return this.pixels[x][y];
    }
    public delete(x: number, y: number) {
        this.validateX(x);
        this.validateY(y);
        if (!this.pixels.hasOwnProperty(x)) {
            return;
        }
        if (!this.pixels[x].hasOwnProperty(y)) {
            return;
        }
        delete this.pixels[x][y];
    }
}

export class Controller<T, B> {
    private pixelatedDisplay: PixelMap<T, B>;
    constructor(pixelatedDisplay: PixelMap<T, B>) {
        this.pixelatedDisplay = pixelatedDisplay;
    }
    rect(x: number, y: number, width: number, height: number, value: T) {
        for (let xi = x; xi < x + width; xi++) {
            for (let yi = y; yi < y + height; yi++) {
                this.pixelatedDisplay.set(xi, yi, value);
            }
        }
    }
    /*
    0,1,2,3,4,5,6
    cache 0;
    replaceWith -> toReplace
    0 -> 3; cache 3
    3 -> 6; cache 6
    6 -> 2; cache 2
    2 -> 5; cache 5;
    */
    // Wrap Around: const rotated =(((normalizedCurrentCharCode + rotation) % range) + range) % range;
    rotateColumn(x: number, degree: number) {
        let itemInFlight = this.pixelatedDisplay.get(x, 0);
        for (let i = 0; i < this.pixelatedDisplay.getHeight(); i++) {
            const replaceWithIndex =
                ((i * degree) % this.pixelatedDisplay.getHeight()) +
                (this.pixelatedDisplay.getHeight() %
                    this.pixelatedDisplay.getHeight());
            const toReplaceIndex =
                (((replaceWithIndex + degree) %
                    this.pixelatedDisplay.getHeight()) +
                    this.pixelatedDisplay.getHeight()) %
                this.pixelatedDisplay.getHeight();
            let newItemInFlight = this.pixelatedDisplay.get(x, toReplaceIndex);
            this.pixelatedDisplay.set(x, toReplaceIndex, itemInFlight);
            itemInFlight = newItemInFlight;
        }
    }
    rotateRow(y: number, degree: number) {
        let itemInFlight = this.pixelatedDisplay.get(0, y);
        for (let i = 0; i < this.pixelatedDisplay.getWidth(); i++) {
            const replaceWithIndex =
                ((i * degree) % this.pixelatedDisplay.getWidth()) +
                (this.pixelatedDisplay.getWidth() %
                    this.pixelatedDisplay.getWidth());
            const toReplaceIndex =
                (((replaceWithIndex + degree) %
                    this.pixelatedDisplay.getWidth()) +
                    this.pixelatedDisplay.getWidth()) %
                this.pixelatedDisplay.getWidth();
            let newItemInFlight = this.pixelatedDisplay.get(toReplaceIndex, y);
            this.pixelatedDisplay.set(toReplaceIndex, y, itemInFlight);
            itemInFlight = newItemInFlight;
        }
    }
}

export class Count<T, B> {
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
export class Display<T, B> {
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
