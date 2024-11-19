import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
/*
--- Day 6: Probably a Fire Hazard ---
Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.

Furthermore, because you've been especially nice this year, Santa has mailed you instructions on how to display the ideal lighting configuration.

Lights in your grid are numbered from 0 to 999 in each direction; the lights at each corner are at 0,0, 0,999, 999,999, and 999,0. The instructions include whether to turn on, turn off, or toggle various inclusive ranges given as coordinate pairs. Each coordinate pair represents opposite corners of a rectangle, inclusive; a coordinate pair like 0,0 through 2,2 therefore refers to 9 lights in a 3x3 square. The lights all start turned off.

To defeat your neighbors this year, all you have to do is set up your lights by doing the instructions Santa sent you in order.

For example:

turn on 0,0 through 999,999 would turn on (or leave on) every light.
toggle 0,0 through 999,0 would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
turn off 499,499 through 500,500 would turn off (or leave off) the middle four lights.

After following the instructions, how many lights are lit?

--- Part Two ---
You just finish implementing your winning light pattern when you realize you mistranslated Santa's message from Ancient Nordic Elvish.

The light grid you bought actually has individual brightness controls; each light can have a brightness of zero or more. The lights all start at zero.

The phrase turn on actually means that you should increase the brightness of those lights by 1.

The phrase turn off actually means that you should decrease the brightness of those lights by 1, to a minimum of zero.

The phrase toggle actually means that you should increase the brightness of those lights by 2.

What is the total brightness of all lights combined after following Santa's instructions?

For example:

turn on 0,0 through 0,0 would increase the total brightness by 1.
toggle 0,0 through 999,999 would increase the total brightness by 2000000.

*/

export enum Command {
    TurnOff = -1,
    TurnOn = 1,
    Toggle = 2,
}

export interface Action {
    command: Command;
    start: [number, number];
    end: [number, number];
}

class Solution20156b implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        const grid: number[][] = Array.from({ length: 1000 }, () =>
            Array(1000).fill(0)
        );

        for await (let line of iterator) {
            let action = Solution20156b.parseAction(line);
            Solution20156b.executeCommand(action, grid);
        }

        return Promise.resolve(
            Solution20156b.calculateTotalBrightness(grid).toString()
        );
    }

    static parseAction(line: string): Action {
        let command: Command;
        if (line.includes('turn off')) {
            command = Command.TurnOff;
        } else if (line.includes('turn on')) {
            command = Command.TurnOn;
        } else {
            command = Command.Toggle;
        }

        const matches = line.match(/(\d+),(\d+) through (\d+),(\d+)/);
        if (!matches) {
            throw new Error(`Invalid input format: ${line}`);
        }

        const [_, x1, y1, x2, y2] = matches.map(Number);

        return {
            command,
            start: [x1, y1],
            end: [x2, y2],
        };
    }

    static executeCommand(action: Action, grid: number[][]): void {
        const { command, start, end } = action;

        for (let i = start[0]; i <= end[0]; i++) {
            for (let j = start[1]; j <= end[1]; j++) {
                let lightBrightness = grid[i][j] + command;
                grid[i][j] = lightBrightness < 0 ? 0 : lightBrightness;
            }
        }
    }

    static calculateTotalBrightness(grid: number[][]): number {
        return grid
            .flat()
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );
    }
}

export default Solution20156b;
