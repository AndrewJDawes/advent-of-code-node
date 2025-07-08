import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import {
    BuildingConcrete,
    CommandParser,
    findShortestPathToSuccess,
    ItemConcrete,
    ItemSetConcrete,
} from './common.js';

/*
--- Part Two ---
You step into the cleanroom separating the lobby from the isolated area and put on the hazmat suit.

Upon entering the isolated containment area, however, you notice some extra parts on the first floor that weren't listed on the record outside:

An elerium generator.
An elerium-compatible microchip.
A dilithium generator.
A dilithium-compatible microchip.
These work just like the other generators and microchips. You'll have to get them up to assembly as well.

What is the minimum number of steps required to bring all of the objects, including these four new ones, to the fourth floor?

*/

class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        const building = new BuildingConcrete();
        const commandParser = new CommandParser(building);
        for await (let line of iterator) {
            commandParser.execute(line);
        }
        const floors = building.getFloors();
        let floorOne = floors.get(1);
        if (undefined === floorOne) {
            floorOne = new ItemSetConcrete();
            floors.set(1, floorOne);
        }
        [
            new ItemConcrete('elerium', 'generator'),
            new ItemConcrete('elerium', 'microchip'),
            new ItemConcrete('dilithium', 'generator'),
            new ItemConcrete('dilithium', 'microchip'),
        ].forEach((item) => {
            floorOne.addItem(item);
        });
        const path = await findShortestPathToSuccess(building);
        if (path === null) {
            throw new Error(`Unable to find a path`);
        }
        return (path.length - 1).toString();
    }
}
export default Solution;
