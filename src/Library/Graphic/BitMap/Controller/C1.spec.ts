import { expect } from 'chai';
import PixelMap from '../PixelMap/C1.js';
import Controller from './C1.js';
import Display from '../Display/C1.js';
describe('Graphic BitMap PixelMap Controller C1', () => {
    it('draws a rect and rotates columns and rows a positive amount for a grid with odd dimensions', () => {
        const pixelMap = new PixelMap<boolean, false>(7, 7, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display({
            pixelMap,
            printChar: '#',
            printBlankChar: '.',
        });
        expect(display.print()).to.equal(
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
        expect(display.print()).to.equal(
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
        expect(display.print()).to.equal(
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
        expect(display.print()).to.equal(
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
    it('draws a rect and rotates columns and rows a positive amount for a grid with even dimensions', () => {
        const pixelMap = new PixelMap<boolean, false>(8, 8, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display({
            pixelMap,
            printChar: '#',
            printBlankChar: '.',
        });
        expect(display.print()).to.equal(
            [
                '........',
                '........',
                '........',
                '........',
                '........',
                '........',
                '........',
                '........',
            ].join('\n')
        );
        controller.rect(1, 1, 3, 3, true);
        expect(display.print()).to.equal(
            [
                '........',
                '.###....',
                '.###....',
                '.###....',
                '........',
                '........',
                '........',
                '........',
            ].join('\n')
        );
        controller.rotateRow(2, 6);
        expect(display.print()).to.equal(
            [
                '........',
                '.###....',
                '##.....#',
                '.###....',
                '........',
                '........',
                '........',
                '........',
            ].join('\n')
        );
        controller.rotateColumn(3, 5);
        expect(display.print()).to.equal(
            [
                '...#....',
                '.##.....',
                '##.....#',
                '.##.....',
                '........',
                '........',
                '...#....',
                '........',
            ].join('\n')
        );
    });
    it('draws a rect and rotates columns and rows a negative amount for a grid with odd dimensions', () => {
        const pixelMap = new PixelMap<boolean, false>(7, 7, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display({
            pixelMap,
            printChar: '#',
            printBlankChar: '.',
        });
        expect(display.print()).to.equal(
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
        expect(display.print()).to.equal(
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
        expect(display.print()).to.equal(
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
        expect(display.print()).to.equal(
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
    it('draws a rect and rotates columns and rows a negative amount for a grid with even dimensions', () => {
        const pixelMap = new PixelMap<boolean, false>(8, 8, false);
        const controller = new Controller<boolean, false>(pixelMap);
        const display = new Display({
            pixelMap,
            printChar: '#',
            printBlankChar: '.',
        });
        expect(display.print()).to.equal(
            [
                '........',
                '........',
                '........',
                '........',
                '........',
                '........',
                '........',
                '........',
            ].join('\n')
        );
        controller.rect(1, 1, 3, 3, true);
        expect(display.print()).to.equal(
            [
                '........',
                '.###....',
                '.###....',
                '.###....',
                '........',
                '........',
                '........',
                '........',
            ].join('\n')
        );
        controller.rotateRow(2, -3);
        expect(display.print()).to.equal(
            [
                '........',
                '.###....',
                '#.....##',
                '.###....',
                '........',
                '........',
                '........',
                '........',
            ].join('\n')
        );
        controller.rotateColumn(6, -3);
        expect(display.print()).to.equal(
            [
                '........',
                '.###....',
                '#......#',
                '.###....',
                '........',
                '........',
                '........',
                '......#.',
            ].join('\n')
        );
    });
});
