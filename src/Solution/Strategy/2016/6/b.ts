import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import C1 from '../../../../Library/Input/Transformer/ColumnToRow/C1.js';
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
        const counts: Map<string, number>[] = [];
        for await (let line of iterator) {
            const row = line.trim().split('');
            row.forEach((cell, index) => {
                let columnMap: Map<string, number>;
                const existingColumnMap = counts[index];
                if (undefined === existingColumnMap) {
                    columnMap = new Map();
                    counts[index] = columnMap;
                } else {
                    columnMap = existingColumnMap;
                }
                const existingCount = columnMap.get(cell);
                if (undefined === existingCount) {
                    columnMap.set(cell, 0);
                } else {
                    columnMap.set(cell, existingCount + 1);
                }
            });
        }
        return counts
            .map((columnMap) => {
                const sorted = [...columnMap.entries()].sort(
                    ([aChar, aCount], [bChar, bCount]) => {
                        return bCount - aCount;
                    }
                );
                return sorted[sorted.length - 1][0];
            })
            .join('');
    }
}
export default Solution;
