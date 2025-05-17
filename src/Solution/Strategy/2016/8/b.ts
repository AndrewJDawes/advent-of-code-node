import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import CommandParser from '../../../../Library/Graphic/BitMap/CommandParser/C1.js';
import Controller from '../../../../Library/Graphic/BitMap/Controller/C1.js';
import PixelMap from '../../../../Library/Graphic/BitMap/PixelMap/C1.js';
import Display from '../../../../Library/Graphic/BitMap/Display/C1.js';
import Count from '../../../../Library/Graphic/BitMap/Count/C1.js';
/*
--- Part Two ---
You notice that the screen is only capable of displaying capital letters; in the font it uses, each letter is 5 pixels wide and 6 tall.

After you swipe your card, what code is the screen trying to display?
*/

class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        const pixelMap = new PixelMap<boolean, null>(50, 6, null);
        const controller = new Controller<boolean, null>(pixelMap);
        const display = new Display(pixelMap);
        const commandParser = new CommandParser<boolean, null>(
            controller,
            true
        );
        for await (let line of iterator) {
            const command = line.trim();
            commandParser.execute(command);
        }
        return display.print('#', '.');
    }
}
export default Solution;
