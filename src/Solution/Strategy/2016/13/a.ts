import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import { execute, Point } from './common.js';
class Solution implements InterfaceSolutionStrategy {
    start: Point;
    goal: Point;
    inputFetcher: InterfaceInputFetcher;
    constructor(
        inputFetcher: InterfaceInputFetcher,
        start: Point = [1, 1],
        goal: Point = [31, 39],
    ) {
        this.inputFetcher = inputFetcher;
        this.start = start;
        this.goal = goal;
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
        if (instructions.length === 0) {
            throw new Error('No instructions found');
        }
        const inputInteger = parseInt(instructions.pop()!, 10);
        if (Number.isNaN(inputInteger)) {
            throw new Error('Invalid input integer');
        }
        return execute(inputInteger, this.start, this.goal).toString();
    }
}
export default Solution;
