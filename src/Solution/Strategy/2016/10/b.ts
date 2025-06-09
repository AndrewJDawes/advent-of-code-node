import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import {
    CommandParser,
    Controller,
    MonitorForResultsWatchForComparison,
} from './common.js';
/*
--- Day 10: Balance Bots ---
What do you get if you multiply together the values of one chip in each of outputs 0, 1, and 2?
*/
class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    outputsToMultiply: Set<number>;
    constructor(
        inputFetcher: InterfaceInputFetcher,
        outputsToMultiply: Set<number>
    ) {
        this.inputFetcher = inputFetcher;
        this.outputsToMultiply = outputsToMultiply;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        const controller = new Controller({ outputMaxMicrochips: 1 });
        const commandParser = new CommandParser(controller);
        for await (let line of iterator) {
            commandParser.execute(line);
        }
        const outputs = controller.getOutputs();
        const result = Array.from(this.outputsToMultiply)
            .map((outputId) => {
                const output = outputs.get(outputId);
                if (undefined === output) {
                    throw new Error(`Undefined output`);
                }
                return output;
            })
            .map((output) => output.getMicrochips())
            .reduce((prevArr, currMicrochips) => {
                return prevArr.concat(currMicrochips);
            }, [])
            .reduce((prevMicrochip, currMicrochip) => {
                return prevMicrochip * currMicrochip;
            }, 1);
        return result.toString();
    }
}
export default Solution;
