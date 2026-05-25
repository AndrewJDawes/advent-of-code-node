import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import { execute } from './common.js';
class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        const instructions: string[] = [];
        for await (const line of iterator) {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
                instructions.push(trimmed);
            }
        }
        const registers = new Map();
        registers.set('c', 1);
        return execute(instructions, registers).toString();
    }
}
export default Solution;
