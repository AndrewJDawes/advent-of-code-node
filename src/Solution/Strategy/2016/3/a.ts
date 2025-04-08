import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import { sideLengthsAreValid } from './Common.js';
/*
--- Day 3: Squares With Three Sides ---
Now that you can think clearly, you move deeper into the labyrinth of hallways and office furniture that makes up this part of Easter Bunny HQ. This must be a graphic design department; the walls are covered in specifications for triangles.

Or are they?

The design document gives the side lengths of each triangle it describes, but... 5 10 25? Some of these aren't triangles. You can't help but mark the impossible ones.

In a valid triangle, the sum of any two sides must be larger than the remaining side. For example, the "triangle" given above is impossible, because 5 + 10 is not larger than 25.

In your puzzle input, how many of the listed triangles are possible?
*/

class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        let possibleCount = 0;
        for await (let line of iterator) {
            const sideLengthsRaw = line.trim().split(/\s+/);
            const sideLengths = sideLengthsRaw.map((sideLength) => {
                const parsed = parseInt(sideLength, 10);
                if (Number.isNaN(parsed)) {
                    throw new Error(
                        `Unable to parse input number! Raw lengths: ${sideLengthsRaw}. Raw length: ${sideLength}. Parsed length: ${parsed}`
                    );
                }
                return parsed;
            });
            // Conditionally increment counter
            if (sideLengthsAreValid(sideLengths)) {
                ++possibleCount;
            }
        }
        return possibleCount.toString();
    }
}
export default Solution;
