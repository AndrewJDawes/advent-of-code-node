import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
/*
--- Day 3: Squares With Three Sides ---
Now that you can think clearly, you move deeper into the labyrinth of hallways and office furniture that makes up this part of Easter Bunny HQ. This must be a graphic design department; the walls are covered in specifications for triangles.

Or are they?

The design document gives the side lengths of each triangle it describes, but... 5 10 25? Some of these aren't triangles. You can't help but mark the impossible ones.

In a valid triangle, the sum of any two sides must be larger than the remaining side. For example, the "triangle" given above is impossible, because 5 + 10 is not larger than 25.

In your puzzle input, how many of the listed triangles are possible?
*/

class Solution20162a implements InterfaceSolutionStrategy {
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
            // Use slice to extract the number at positioin
            // Send the remaining to a (eventually memoized) function that sums all elems in array
            // Compare sum to number
            // Conditionally increment counter
            let possible = true;
            for (let index = 0; index < sideLengths.length; index++) {
                const val = sideLengths[index];
                if (
                    val >=
                    [
                        ...sideLengths.slice(0, index),
                        ...sideLengths.slice(index + 1),
                    ].reduce((summed, toSum) => summed + toSum, 0)
                ) {
                    possible = false;
                    break;
                }
            }
            if (possible) {
                ++possibleCount;
            }
        }
        return possibleCount.toString();
    }
}
export default Solution20162a;
