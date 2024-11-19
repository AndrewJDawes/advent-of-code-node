import InterfaceSolutionStrategy from '../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../InputFetcher/Interface/Service.js';
/*
--- Day 1: No Time for a Taxicab-- -
Santa's sleigh uses a very high-precision clock to guide its movements, and the clock's oscillator is regulated by stars. Unfortunately, the stars have been stolen... by the Easter Bunny. To save Christmas, Santa needs you to retrieve all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You're airdropped near Easter Bunny Headquarters in a city somewhere. "Near", unfortunately, is as close as you can get - the instructions on the Easter Bunny Recruiting Document the Elves intercepted start here, and nobody had time to work them out further.

The Document indicates that you should start at the given coordinates (where you just landed) and face North. Then, follow the provided sequence: either turn left (L) or right (R) 90 degrees, then walk forward the given number of blocks, ending at a new intersection.

There's no time to follow such ridiculous instructions on foot, though, so you take a moment and work out the destination. Given that you can only walk on the street grid of the city, how far is the shortest path to the destination?

For example:

Following R2, L3 leaves you 2 blocks East and 3 blocks North, or 5 blocks away.
R2, R2, R2 leaves you 2 blocks due South of your starting position, which is 2 blocks away.
R5, L5, R5, R3 leaves you 12 blocks away.
How many blocks away is Easter Bunny HQ?
*/

export enum HandDirection {
    R = 1,
    L = -1,
}
export enum CardinalDirection {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}
export enum Axis {
    NorthSouth = 0,
    EastWest = 1,
}
export enum Factor {
    NorthEast = 1,
    SouthWest = -1,
}
class Solution20161 implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        let currentCardinalDirection = CardinalDirection.North;
        const numberOfRotations = 1;
        let axesDifferences = {
            [Axis.NorthSouth]: 0,
            [Axis.EastWest]: 0,
        };
        // let input = '';
        // for await (let line of iterator) {
        //     input += line;
        // }
        // console.log({ input });
        for await (let line of iterator) {
            const splitIntoInstructions = line.split(', ');
            splitIntoInstructions.forEach((instruction) => {
                const { movement, handDirection } =
                    Solution20161.parseInstruction(instruction);
                // Determine which direction
                currentCardinalDirection = Solution20161.rotate(
                    currentCardinalDirection,
                    handDirection,
                    numberOfRotations
                );
                // Add to correct axis
                const axis = Solution20161.cardinalDirectionToAxis(
                    currentCardinalDirection
                );
                // Determine whether positive or negative
                const factor = Solution20161.cardinalDirectionToFactor(
                    currentCardinalDirection
                );
                axesDifferences[axis] += movement * factor;
            });
        }
        return Promise.resolve(
            Math.abs(
                Object.values(axesDifferences).reduce(
                    (prev, curr) => prev + curr,
                    0
                )
            ).toString()
        );
    }
    static parseInstruction(instruction: string): {
        handDirection: HandDirection;
        movement: number;
    } {
        const regexApplied = /^([LR])([0-9]+)$/.exec(instruction);
        if (null === regexApplied) {
            throw new Error(`Unable to parseInstruction: ${instruction}`);
        }
        const handDirectionString = regexApplied[1];
        if (!Solution20161.isKeyInHandDirection(handDirectionString)) {
            throw new Error(`Invalid handDirection: ${handDirectionString}`);
        }
        const movement = Number.parseInt(regexApplied[2]);
        const handDirection =
            Solution20161.getHandDirectionFromKey(handDirectionString);
        return {
            movement,
            handDirection,
        };
    }
    static isKeyInHandDirection(
        key: string
    ): key is keyof typeof HandDirection {
        return key in HandDirection;
    }
    static getHandDirectionFromKey(
        key: keyof typeof HandDirection
    ): HandDirection {
        return HandDirection[key];
    }
    static cardinalDirectionToAxis(cardinalDirection: CardinalDirection): Axis {
        return cardinalDirection % 2;
    }
    static cardinalDirectionToFactor(
        cardinalDirection: CardinalDirection
    ): Factor {
        return cardinalDirection < 2 ? 1 : -1;
    }
    static rotate(
        currentCardinalDirection: CardinalDirection,
        rotationDirection: HandDirection,
        numberOfRotations: number
    ): CardinalDirection {
        return Math.abs(
            (4 +
                (currentCardinalDirection +
                    rotationDirection * numberOfRotations)) %
                4
        );
    }
}
export default Solution20161;
