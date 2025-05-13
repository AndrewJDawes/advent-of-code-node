import { expect } from 'chai';
import { PixelMap, Controller, Display } from './common.js';
describe('Controller', () => {
    it('draws a rect', () => {
        const pixelMap = new PixelMap<boolean, false>(7, 7, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display(pixelMap);
        console.log(display.print('#', '.'));
        controller.rect(0, 0, 3, 3, true);
        console.log(display.print('#', '.'));
        controller.rotateRow(1, 6);
        console.log(display.print('#', '.'));
    });
});
