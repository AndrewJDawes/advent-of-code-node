import { expect } from 'chai';
import {
    Building,
    BuildingConcrete,
    failure,
    findShortestPathToSuccess,
    FloorMapConcrete,
    getFunctionGetPermutatedBuildings,
    getFunctionGetPermutatedBuildingsFromFloorToFloor,
    getFunctionGetSolutionPathByBuilding,
    ItemConcrete,
    ItemSetConcrete,
    SolutionPath,
    SolutionPathConcreteFactoryConcrete,
    success,
} from './common.js';
describe('201611a', () => {
    describe('getFunctionGetPermutatedBuildingsFromFloorToFloor', () => {
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
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
                        [4, new ItemSetConcrete([])],
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
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
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations C', () => {
            const building = new BuildingConcrete(
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                3
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                3,
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
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations D', () => {
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
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                2,
                1
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations E', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                1,
                2
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations F', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                2,
                3
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations G', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                3
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                3,
                4
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations H', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                4,
                3
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
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
        it('generates expected permutations I', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                3,
                4
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations J', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                4,
                3
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
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
        it('generates expected permutations K', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            const getPermutatedBuildingsFromFloorToFloor =
                getFunctionGetPermutatedBuildingsFromFloorToFloor();
            const permutations = getPermutatedBuildingsFromFloorToFloor(
                building,
                3,
                4
            );
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [3, new ItemSetConcrete([])],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
    });
    describe('getFunctionGetPermutatedBuildings', () => {
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
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
                        [4, new ItemSetConcrete([])],
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
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
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations C', () => {
            const building = new BuildingConcrete(
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                3
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
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
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations D', () => {
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
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations E', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations F', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
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
        it('generates expected permutations G', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                3
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations H', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
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
        it('generates expected permutations I', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
        it('generates expected permutations J', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
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
        it('generates expected permutations K', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
                getPermutatedBuildingsFromFloorToFloor:
                    getFunctionGetPermutatedBuildingsFromFloorToFloor(),
            });
            const permutations = getPermutatedBuildings(building);
            const expectedPermutation = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [3, new ItemSetConcrete([])],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(
                permutations.findIndex((permutation) =>
                    permutation.equals(expectedPermutation)
                )
            ).to.not.equal(-1);
        });
    });
    describe('failure', () => {
        it('treats building as non-failure A', () => {
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure B', () => {
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure C', () => {
            const building = new BuildingConcrete(
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                3
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure D', () => {
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
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure E', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [
                            1,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure F', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [
                            2,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                2
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure G', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                3
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure H', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure I', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure J', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure K', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [
                            3,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                            ]),
                        ],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                3
            );
            expect(failure(building)).to.be.false;
        });
        it('treats building as non-failure L', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [3, new ItemSetConcrete([])],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(failure(building)).to.be.false;
        });
    });
    describe('success', () => {
        it('treats building as success A', () => {
            const building = new BuildingConcrete(
                new FloorMapConcrete(
                    new Map([
                        [1, new ItemSetConcrete([])],
                        [2, new ItemSetConcrete([])],
                        [3, new ItemSetConcrete([])],
                        [
                            4,
                            new ItemSetConcrete([
                                new ItemConcrete('H', 'microchip'),
                                new ItemConcrete('L', 'microchip'),
                                new ItemConcrete('H', 'generator'),
                                new ItemConcrete('L', 'generator'),
                            ]),
                        ],
                    ])
                ),
                4
            );
            expect(success(building)).to.be.true;
        });
    });
    describe('SolutionPath', () => {
        it('advances', () => {
            const newSolutionPathFactoryConcrete =
                new SolutionPathConcreteFactoryConcrete();
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            const solution =
                newSolutionPathFactoryConcrete.getInstance(building);
            while (solution.getState() === null) {
                solution.advance();
            }
            expect(solution.getState()).to.eql('success');
            expect(solution.getStep()).to.eql(12);
        });
    });
    describe('findShortestPathToSuccess', () => {
        it('solves initial state A', () => {
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
                        [4, new ItemSetConcrete([])],
                    ])
                ),
                1
            );
            const results = findShortestPathToSuccess(building);
            expect(results?.length).to.equal(12);
        });
    });
});
