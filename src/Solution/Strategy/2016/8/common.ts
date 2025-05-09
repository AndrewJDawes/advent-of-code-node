export class PixelMap<T> {
    private width: number;
    private height: number;
    private pixels: Array<Array<T>>;
    private blank: T;
    constructor(width: number, height: number, blank: T) {
        this.width = width;
        this.height = height;
        this.blank = blank;
        this.pixels = new Array(this.width);
    }
    public getWidth() {
        return this.width;
    }
    public getHeight() {
        return this.height;
    }
    public set(x: number, y: number, value: T) {
        if (!this.pixels.hasOwnProperty(x)) {
            this.pixels[x] = new Array(this.height);
        }
        this.pixels[x][y] = value;
    }
    public get(x: number, y: number) {
        if (!this.pixels.hasOwnProperty(x)) {
            return this.blank;
        }
        if (!this.pixels[x].hasOwnProperty(y)) {
            return this.blank;
        }
        return this.pixels[x][y];
    }
    public delete(x: number, y: number) {
        if (!this.pixels.hasOwnProperty(x)) {
            return;
        }
        if (!this.pixels[x].hasOwnProperty(y)) {
            return;
        }
        delete this.pixels[x][y];
    }
}

export class Controller<T> {
    private pixelatedDisplay: PixelMap<T>;
    constructor(pixelatedDisplay: PixelMap<T>) {
        this.pixelatedDisplay = pixelatedDisplay;
    }
    rect(x: number, y: number, width: number, height: number, value: T) {
        for (let xi = x; xi < x + width; xi++) {
            for (let yi = y; yi < y + height; yi++) {
                this.pixelatedDisplay.set(xi, yi, value);
            }
        }
    }
    rotateColumn(x: number, factor: number) {}
    rotateRow(y: number, factor: number) {}
    print() {}
}
