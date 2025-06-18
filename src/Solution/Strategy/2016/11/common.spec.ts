import { expect } from 'chai';
import {
    BuildingConcrete,
    FloorMapConcrete,
    getMemoizedPermutatedBuildings,
    getMemoizedPermutatedBuildingsFromFloorToFloor,
    getStarterSolutionData,
    ItemConcrete,
    ItemSetConcrete,
    SolutionPath,
    SolutionPathConcreteFactoryConcrete,
} from './common.js';
describe('201611a', () => {
    describe('getMemoizedPermutatedBuildingsFromFloorToFloor', () => {
        it('generates expected permutations A', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                1
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getMemoizedPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                1,
                2
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                2
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations B', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                2
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getMemoizedPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                2,
                3
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
    });
    describe('SolutionPath', () => {
        it('solves', () => {
            /*
                F4 .  .  .  .  .
                F3 .  .  .  LG .
                F2 .  HG .  .  .
                F1 E  .  HM .  LM
            */
            const solutionPathConcreteFactoryConcrete =
                new SolutionPathConcreteFactoryConcrete();
            const floors = new FloorMapConcrete();
            const building = new BuildingConcrete(floors, 1);
            floors.set(
                1,
                new ItemSetConcrete([
                    new ItemConcrete('H', 'microchip'),
                    new ItemConcrete('L', 'microchip'),
                ])
            );
            floors.set(
                2,
                new ItemSetConcrete([new ItemConcrete('H', 'generator')])
            );
            floors.set(
                3,
                new ItemSetConcrete([new ItemConcrete('L', 'generator')])
            );
            const solutionPathConcrete =
                solutionPathConcreteFactoryConcrete.getInstance(building);
            const solution = getStarterSolutionData();
            solutionPathConcrete.solve([], solution);
            // console.log({ solutionPathConcrete });
            // console.log(JSON.stringify({ solutionPathConcrete }, null, 2));
            expect(solution.minKnownSolutionPath).to.eql(1);
        });
    });
});
