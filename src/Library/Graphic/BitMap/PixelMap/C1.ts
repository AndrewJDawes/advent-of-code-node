import { OutOfBoundsException } from '../Exceptions.js';
import { PixelMap as PixelMapInterface } from '../Interfaces.js';
export default class PixelMap<T, B> implements PixelMapInterface<T, B> {
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
