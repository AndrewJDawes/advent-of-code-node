import { PixelMap, Controller as ControllerInterface } from '../Interfaces.js';

export default class Controller<T, B> implements ControllerInterface<T, B> {
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
