import { expect } from 'chai';
import { PixelMap, Controller, Display } from './common.js';
describe('Controller', () => {
    it('draws a rect and rotates columns and rows a positive amount', () => {
        const pixelMap = new PixelMap<boolean, false>(7, 7, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display(pixelMap);
        expect(display.print('#', '.')).to.equal(
            [
                '.......',
                '.......',
                '.......',
                '.......',
                '.......',
                '.......',
                '.......',
            ].join('\n')
        );
        controller.rect(0, 0, 3, 3, true);
        expect(display.print('#', '.')).to.equal(
            [
                '###....',
                '###....',
                '###....',
                '.......',
                '.......',
                '.......',
                '.......',
            ].join('\n')
        );
        controller.rotateRow(1, 6);
        expect(display.print('#', '.')).to.equal(
            [
                '###....',
                '##....#',
                '###....',
                '.......',
                '.......',
                '.......',
                '.......',
            ].join('\n')
        );
        controller.rotateColumn(2, 5);
        expect(display.print('#', '.')).to.equal(
            [
                '###....',
                '##....#',
                '##.....',
                '.......',
                '.......',
                '..#....',
                '.......',
            ].join('\n')
        );
    });
    it('draws a rect and rotates columns and rows a negative amount', () => {
        const pixelMap = new PixelMap<boolean, false>(7, 7, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display(pixelMap);
        expect(display.print('#', '.')).to.equal(
            [
                '.......',
                '.......',
                '.......',
                '.......',
                '.......',
                '.......',
                '.......',
            ].join('\n')
        );
        controller.rect(1, 1, 3, 3, true);
        expect(display.print('#', '.')).to.equal(
            [
                '.......',
                '.###...',
                '.###...',
                '.###...',
                '.......',
                '.......',
                '.......',
            ].join('\n')
        );
        controller.rotateRow(2, -3);
        expect(display.print('#', '.')).to.equal(
            [
                '.......',
                '.###...',
                '#....##',
                '.###...',
                '.......',
                '.......',
                '.......',
            ].join('\n')
        );
        controller.rotateColumn(5, -3);
        expect(display.print('#', '.')).to.equal(
            [
                '.......',
                '.###...',
                '#.....#',
                '.###...',
                '.......',
                '.......',
                '.....#.',
            ].join('\n')
        );
    });
});
