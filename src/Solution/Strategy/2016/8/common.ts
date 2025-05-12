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
    rotateColumn(x: number, factor: number) {
        for (let i = 0; i < factor; i++) {
            let itemInFlight = this.pixelatedDisplay.get(
                x,
                this.pixelatedDisplay.getHeight() - 1
            );
            for (
                let toReplaceIndexY = 0;
                toReplaceIndexY < this.pixelatedDisplay.getHeight();
                toReplaceIndexY++
            ) {
                let newItemInFlight = this.pixelatedDisplay.get(
                    x,
                    toReplaceIndexY
                );
                this.pixelatedDisplay.set(x, toReplaceIndexY, itemInFlight);
                itemInFlight = newItemInFlight;
            }
        }
    }
    rotateRow(y: number, factor: number) {
        for (let i = 0; i < factor; i++) {
            let itemInFlight = this.pixelatedDisplay.get(
                this.pixelatedDisplay.getWidth() - 1,
                y
            );
            for (
                let toReplaceIndexX = 0;
                toReplaceIndexX < this.pixelatedDisplay.getWidth();
                toReplaceIndexX++
            ) {
                let newItemInFlight = this.pixelatedDisplay.get(
                    toReplaceIndexX,
                    y
                );
                this.pixelatedDisplay.set(toReplaceIndexX, y, itemInFlight);
                itemInFlight = newItemInFlight;
            }
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
        let chars: string[] = [];
        for (let x = 0; x < this.pixelatedDisplay.getWidth(); x++) {
            for (let y = 0; y < this.pixelatedDisplay.getHeight(); y++) {
                const char = this.pixelatedDisplay.get(x, y);
                chars.push(
                    char === this.pixelatedDisplay.getBlank()
                        ? printBlankChar
                        : printChar
                );
            }
            chars.push('\n');
        }
        return chars.join('');
    }
}
