import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import {
    countCharacterOccurrences,
    parseRoomInputParts,
    sanitizeRoom,
    sortCharNumberMapDesc,
} from './Common.js';
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
        let realRoomSectorSum = 0;
        for await (let line of iterator) {
            const alphaCounts = new Map<string, number>();
            try {
                const { room, sector, checksum } = parseRoomInputParts(line);
                const sectorNumber = parseInt(sector);
                const sanitizedRoom = sanitizeRoom(room);
                const occurrences = countCharacterOccurrences(sanitizedRoom);
                const sortedOccurrences = sortCharNumberMapDesc(occurrences);
                const firstFiveChars = sortedOccurrences
                    .slice(0, 5)
                    .map((occurrence) => occurrence[0]);
                const firstFiveCharsJoined = firstFiveChars.join('');
                // TODO - check if room is "valid"
                if (firstFiveCharsJoined === checksum) {
                    realRoomSectorSum++;
                }
            } catch (e) {
                console.error(`Skipping room due to error: ${e}`);
            }
        }
        return realRoomSectorSum.toString();
    }
}
export default Solution;
