import { PixelMap, Controller as ControllerInterface } from '../Interfaces.js';

export default class Controller<T, B> implements ControllerInterface<T, B> {
    private pixelMap: PixelMap<T, B>;
    constructor(pixelatedDisplay: PixelMap<T, B>) {
        this.pixelMap = pixelatedDisplay;
    }
    rect(x: number, y: number, width: number, height: number, value: T) {
        for (let xi = x; xi < x + width; xi++) {
            for (let yi = y; yi < y + height; yi++) {
                this.pixelMap.set(xi, yi, value);
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
        let itemInFlight = this.pixelMap.get(x, 0);
        for (let i = 0; i < this.pixelMap.getHeight(); i++) {
            const replaceWithIndex =
                ((i * degree) % this.pixelMap.getHeight()) +
                (this.pixelMap.getHeight() % this.pixelMap.getHeight());
            const toReplaceIndex =
                (((replaceWithIndex + degree) % this.pixelMap.getHeight()) +
                    this.pixelMap.getHeight()) %
                this.pixelMap.getHeight();
            let newItemInFlight = this.pixelMap.get(x, toReplaceIndex);
            this.pixelMap.set(x, toReplaceIndex, itemInFlight);
            itemInFlight = newItemInFlight;
        }
    }
    rotateRow(y: number, degree: number) {
        let itemInFlight = this.pixelMap.get(0, y);
        for (let i = 0; i < this.pixelMap.getWidth(); i++) {
            const replaceWithIndex =
                ((i * degree) % this.pixelMap.getWidth()) +
                (this.pixelMap.getWidth() % this.pixelMap.getWidth());
            const toReplaceIndex =
                (((replaceWithIndex + degree) % this.pixelMap.getWidth()) +
                    this.pixelMap.getWidth()) %
                this.pixelMap.getWidth();
            let newItemInFlight = this.pixelMap.get(toReplaceIndex, y);
            this.pixelMap.set(toReplaceIndex, y, itemInFlight);
            itemInFlight = newItemInFlight;
        }
    }
}
