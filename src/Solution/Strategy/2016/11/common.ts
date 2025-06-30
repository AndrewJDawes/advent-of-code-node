import { BTree, BTreeInterface, BTreeKeyInterface } from './btree.js';

export type ItemType = 'generator' | 'microchip';
export interface Item {
    getElement(): string;
    getType(): ItemType;
    copy(): Item;
    equals(item: Item): boolean;
}
export class ItemConcrete implements Item {
    private element: string;
    private type: ItemType;
    constructor(element: string, type: ItemType) {
        this.element = element;
        this.type = type;
    }
    getElement(): string {
        return this.element;
    }
    getType(): ItemType {
        return this.type;
    }
    copy(): Item {
        return new ItemConcrete(this.element, this.type);
    }
    equals(item: Item): boolean {
        return (
            this.getElement() === item.getElement() &&
            this.getType() === item.getType()
        );
    }
}
export interface ItemSet extends Iterable<Item> {
    addItem(item: Item): void;
    getItem(item: Item): Item | undefined;
    deleteItem(item: Item): void;
    copy(): ItemSet;
    difference(itemSet: ItemSet): ItemSet;
    equals(itemSet: ItemSet): boolean;
    length(): number;
}

export class ItemSetConcrete implements ItemSet {
    private items: Item[];
    constructor(items: Item[] = []) {
        this.items = items;
    }
    addItem(item: Item) {
        if (undefined !== this.getItem(item)) {
            throw new Error(
                `Item with element ${item.getElement()} and type ${item.getType()} already exists`
            );
        }
        this.items.push(item);
    }
    getItem(item: Item) {
        return this.items.find((existingItem) => {
            return item.equals(existingItem);
        });
    }
    deleteItem(item: Item) {
        const existingItemIndex = this.items.findIndex((existingItem) =>
            item.equals(existingItem)
        );
        if (-1 === existingItemIndex) {
            throw new Error(
                `Unable to find existing item! element: ${item.getElement()}, type: ${item.getType()}`
            );
        }
        this.items.splice(existingItemIndex, 1);
    }
    [Symbol.iterator]() {
        let index = 0;
        const arr = [...this.items].sort((a, b) => {
            const aString = `${a.getElement()}${a.getType()}`;
            const bString = `${b.getElement()}${b.getType()}`;
            if (aString === bString) {
                return 0;
            }
            return aString < bString ? -1 : 1;
        });
        return {
            next(): IteratorResult<Item> {
                if (index < arr.length) {
                    const value = arr[index++];
                    return { value, done: false };
                }
                return { value: undefined, done: true };
            },
        };
    }
    copy(): ItemSet {
        return new ItemSetConcrete(this.items.map((item) => item.copy()));
    }
    difference(itemSet: ItemSet): ItemSet {
        const differenceSet = new ItemSetConcrete();
        const itemSetBCopy = itemSet.copy();
        for (const itemA of this) {
            let itemAFoundInB = false;
            for (const itemB of itemSetBCopy) {
                if (itemA.equals(itemB)) {
                    itemAFoundInB = true;
                    itemSetBCopy.deleteItem(itemB);
                    break;
                }
            }
            if (!itemAFoundInB) {
                differenceSet.addItem(itemA);
            }
        }
        for (const itemB of itemSetBCopy) {
            differenceSet.addItem(itemB);
        }
        return differenceSet;
    }
    length(): number {
        return this.items.length;
    }
    equals(itemSet: ItemSet): boolean {
        return this.difference(itemSet).length() === 0;
    }
}

export interface FloorMap {
    set(floorNumber: number, floor: ItemSet): void;
    get(floorNumber: number): ItemSet | undefined;
    entries(): MapIterator<[number, ItemSet]>;
    keys(): MapIterator<number>;
    values(): MapIterator<ItemSet>;
    equals(floorMap: FloorMap): boolean;
    copy(): FloorMap;
}

export class FloorMapConcrete implements FloorMap {
    private floors: Map<number, ItemSet>;
    constructor(floors: Map<number, ItemSet> = new Map()) {
        this.floors = floors;
    }
    set(floorNumber: number, floor: ItemSet) {
        this.floors.set(floorNumber, floor);
    }
    get(floorNumber: number): ItemSet | undefined {
        return this.floors.get(floorNumber);
    }
    delete(floorNumber: number) {
        if (undefined === this.get(floorNumber)) {
            throw new Error(
                `Floor with floorNumber ${floorNumber} does not exist and therefore cannot be deleted`
            );
        }
        this.floors.delete(floorNumber);
    }
    entries() {
        return this.floors.entries();
    }
    keys() {
        return this.floors.keys();
    }
    values() {
        return this.floors.values();
    }
    equals(floorMap: FloorMap): boolean {
        for (const [k, v] of this.entries()) {
            const otherFloor = floorMap.get(k);
            if (undefined === otherFloor || !otherFloor.equals(v)) {
                return false;
            }
        }
        for (const [k, v] of floorMap.entries()) {
            const thisFloor = this.get(k);
            if (undefined === thisFloor || !thisFloor.equals(v)) {
                return false;
            }
        }
        return true;
    }
    copy() {
        return new FloorMapConcrete(
            new Map(
                [...this.floors.entries()].map(([number, itemSet]) => {
                    return [number, itemSet.copy()];
                })
            )
        );
    }
    toJSON() {
        return [...this.floors.entries()].map(([key, value]) => {
            return [key, [...value]];
        });
    }
}

export interface Building {
    getFloors(): FloorMap;
    setFloors(floors: FloorMap): void;
    getElevatorFloorNumber(): number;
    setElevatorFloorNumber(floorNumber: number): void;
    moveItemsFromFloorNumberToFloorNumber(
        fromFloorNumber: number,
        toFloorNumber: number,
        items: ItemSet
    ): void;
    copy(): Building;
    equals(building: Building): boolean;
}
export class BuildingConcrete implements Building {
    private floors: FloorMap;
    private elevatorFloorNumber: number;
    constructor(
        floors: FloorMap = new FloorMapConcrete(),
        elevatorFloorNumber: number = 1
    ) {
        this.floors = floors;
        this.elevatorFloorNumber = elevatorFloorNumber;
    }
    getFloors() {
        return this.floors;
    }
    setFloors(floors: FloorMap) {
        this.floors = floors;
    }
    getElevatorFloorNumber() {
        return this.elevatorFloorNumber;
    }
    setElevatorFloorNumber(floorNumber: number) {
        this.elevatorFloorNumber = floorNumber;
    }
    copy() {
        return new BuildingConcrete(
            this.floors.copy(),
            this.elevatorFloorNumber
        );
    }
    equals(building: Building) {
        return (
            this.getElevatorFloorNumber() ===
                building.getElevatorFloorNumber() &&
            this.getFloors().equals(building.getFloors())
        );
    }
    moveItemsFromFloorNumberToFloorNumber(
        fromFloorNumber: number,
        toFloorNumber: number,
        items: ItemSet
    ) {
        const fromFloor = this.getFloors().get(fromFloorNumber);
        if (undefined === fromFloor) {
            throw Error(
                `Unable to get fromFloor with fromFloorNumber ${fromFloorNumber}`
            );
        }
        const toFloor = this.getFloors().get(toFloorNumber);
        if (undefined === toFloor) {
            throw Error(
                `Unable to get toFloor with toFloorNumber ${toFloorNumber}`
            );
        }
        let counter = 0;
        for (const item of items) {
            fromFloor.deleteItem(item);
            toFloor.addItem(item);
            counter++;
        }
        this.setElevatorFloorNumber(toFloorNumber);
    }
}

export class SolutionPath {
    private step: number;
    private state: SolutionState | null;
    private building: Building;
    private openEndedPaths: SolutionPath[] | null;
    private getPermutatedBuildings: (building: Building) => Building[];
    private getSolutionPathByBuilding: (building: Building) => SolutionPath;
    private knownSolutionPath: SolutionPath | null;
    constructor({
        building,
        step = 0,
        getPermutatedBuildings,
        getSolutionPathByBuilding,
    }: {
        building: Building;
        step?: number;
        getPermutatedBuildings: (building: Building) => Building[];
        getSolutionPathByBuilding: (building: Building) => SolutionPath;
    }) {
        this.building = building;
        this.step = step;
        this.state = null;
        this.knownSolutionPath = null;
        this.openEndedPaths = null;
        this.getPermutatedBuildings = getPermutatedBuildings;
        this.getSolutionPathByBuilding = getSolutionPathByBuilding;
    }
    getStep() {
        return this.step;
    }
    getBuilding() {
        return this.building;
    }
    getState() {
        return this.state;
    }
    getKnownSolutionPath() {
        return this.knownSolutionPath;
    }
    setSuccess(knownSolutionPath: SolutionPath) {
        this.state = 'success';
        this.knownSolutionPath = knownSolutionPath;
    }
    advance(step: number | null = null) {
        if (step === null) {
            this.step++;
        } else {
            if (step <= this.step) {
                return;
            }
            this.step = step;
        }
        if (null !== this.openEndedPaths) {
            this.openEndedPaths.forEach((openEndedPath) =>
                openEndedPath.advance(this.step)
            );
            this.openEndedPaths = this.openEndedPaths.filter(
                (openEndedPath) => openEndedPath.getState() !== 'failure'
            );
            if (this.openEndedPaths.length === 0) {
                this.state = 'failure';
            }
            const successPath = this.openEndedPaths.find(
                (openEndedPath) => openEndedPath.getState() === 'success'
            );
            if (successPath) {
                this.setSuccess(successPath);
            }
            return;
        }
        if (success(this.building)) {
            this.setSuccess(this);
            return;
        }
        if (failure(this.building)) {
            this.state = 'failure';
            return;
        }
        this.openEndedPaths = this.getPermutatedBuildings(this.building).map(
            (building) => this.getSolutionPathByBuilding(building)
        );
    }
    toJSON() {
        return {
            ...Object.entries(this)
                .filter(
                    ([key, value]) =>
                        !['openEndedPaths', 'knownSolutionPath'].includes(key)
                )
                .reduce((prev, curr) => {
                    return { ...prev, [curr[0]]: curr[1] };
                }, {}),
        };
    }
}

export type SolutionState = 'success' | 'failure';
export class SolutionPathConcreteFactoryConcrete {
    private getPermutatedBuildings: (building: Building) => Building[];
    private getSolutionPathByBuilding: (building: Building) => SolutionPath;
    constructor() {
        this.getPermutatedBuildings = getFunctionGetPermutatedBuildings({
            getPermutatedBuildingsFromFloorToFloor:
                getFunctionGetPermutatedBuildingsFromFloorToFloor({
                    getMemoizedBuilding: getFunctionGetMemoizedBuilding(),
                }),
        });
        this.getSolutionPathByBuilding = getFunctionGetSolutionPathByBuilding({
            getPermutatedBuildings: this.getPermutatedBuildings,
        });
    }

    getInstance(building: Building) {
        return new SolutionPath({
            building,
            getPermutatedBuildings: this.getPermutatedBuildings,
            getSolutionPathByBuilding: this.getSolutionPathByBuilding,
        });
    }
}

export function success(building: Building) {
    // all items and elevator on 4th floor
    // if (building.getElevatorFloorNumber() !== 4) {
    //     return false;
    // }
    const floors = building.getFloors();
    for (const [floorNumber, items] of floors.entries()) {
        if (floorNumber !== 4 && items.length() > 0) {
            return false;
        }
    }
    return true;
}

export function failure(building: Building) {
    // if a chip
    // is ever left in the same area as another RTG
    // and it's not connected to its own RTG
    // the chip will be fried
    const floors = building.getFloors();
    for (const items of floors.values()) {
        const generators = [...items].filter(
            (item) => item.getType() === 'generator'
        );
        const microchips = [...items].filter(
            (item) => item.getType() === 'microchip'
        );
        if (generators.length > 0) {
            for (const microchip of microchips) {
                if (
                    undefined ===
                    items.getItem(
                        new ItemConcrete(microchip.getElement(), 'generator')
                    )
                ) {
                    // fried
                    return true;
                }
            }
        }
    }
    return false;
}

export function getFunctionGetSolutionPathByBuilding({
    getPermutatedBuildings,
}: {
    getPermutatedBuildings: (building: Building) => Building[];
}) {
    const memoizedSolutionPaths: SolutionPath[] = [];
    return function getSolutionPathByBuilding(building: Building) {
        const memoizedSolutionPath = memoizedSolutionPaths.find(
            (existingMemoizedSolutionPath) => {
                return existingMemoizedSolutionPath
                    .getBuilding()
                    .equals(building);
            }
        );
        if (undefined !== memoizedSolutionPath) {
            return memoizedSolutionPath;
        }
        const newMemoizedSolutionPath = new SolutionPath({
            building,
            getPermutatedBuildings,
            getSolutionPathByBuilding,
        });
        memoizedSolutionPaths.push(newMemoizedSolutionPath);
        return newMemoizedSolutionPath;
    };
}

export function getFunctionGetPermutatedBuildings({
    getPermutatedBuildingsFromFloorToFloor,
}: {
    getPermutatedBuildingsFromFloorToFloor: (
        building: Building,
        fromFloorNumber: number,
        toFloorNumber: number
    ) => Building[];
}) {
    const memoizedPermutatedBuildingMap: Map<Building, Building[]> = new Map();
    return (building: Building) => {
        const existingMemoizedPermutatedBuildingMap =
            memoizedPermutatedBuildingMap.get(building);
        if (undefined !== existingMemoizedPermutatedBuildingMap) {
            return existingMemoizedPermutatedBuildingMap;
        }
        const buildingPermutations: Building[] = [];
        const floors = building.getFloors();
        const floorNumbers = [...floors.keys()].sort();
        const elevatorFloorNumber = building.getElevatorFloorNumber();
        const elevatorFloorNumberIndex = floorNumbers.findIndex(
            (floorNumber) => elevatorFloorNumber === floorNumber
        );
        if (undefined === elevatorFloorNumberIndex) {
            throw Error(`Unable to find elevatorFloorNumber in floorNumbers!`);
        }
        const elevatorFloor = floors.get(elevatorFloorNumber);
        if (undefined === elevatorFloor) {
            throw new Error(`elevatorFloor is undefined!`);
        }
        const targetFloorIndexA = elevatorFloorNumberIndex - 1;
        const targetFloorIndexB = elevatorFloorNumberIndex + 1;
        const targetFloorNumberA = floorNumbers[targetFloorIndexA];
        const targetFloorNumberB = floorNumbers[targetFloorIndexB];

        if (targetFloorIndexA >= 0) {
            buildingPermutations.push(
                ...getPermutatedBuildingsFromFloorToFloor(
                    building,
                    elevatorFloorNumber,
                    targetFloorNumberA
                )
            );
        }
        if (targetFloorIndexB < floorNumbers.length) {
            buildingPermutations.push(
                ...getPermutatedBuildingsFromFloorToFloor(
                    building,
                    elevatorFloorNumber,
                    targetFloorNumberB
                )
            );
        }
        memoizedPermutatedBuildingMap.set(building, buildingPermutations);
        return buildingPermutations;
    };
}

export function getFunctionGetMemoizedBuilding(
    memoizedBuildingsArray: Building[] = []
) {
    const memoizedBuildings: BTreeInterface<string, Building> = new BTree();
    for (const building of memoizedBuildingsArray) {
        memoizedBuildings.insert(new BTreeKeyBuilding(building));
    }
    return function getMemoizedBuilding(building: Building) {
        const buildingBTreeKey = new BTreeKeyBuilding(building);
        const memoizedBuilding = memoizedBuildings.fetch(buildingBTreeKey);
        if (undefined !== memoizedBuilding) {
            return memoizedBuilding.getValue();
        } else {
            memoizedBuildings.insert(buildingBTreeKey);
            return building;
        }
    };
}

export function getFunctionGetPermutatedBuildingsFromFloorToFloor({
    getMemoizedBuilding,
}: {
    getMemoizedBuilding: (building: Building) => Building;
}) {
    const memoizedPermutatedBuildingSets: [
        [Building, number | undefined, number | undefined],
        Building[]
    ][] = [];
    return (
        building: Building,
        fromFloorNumber: number,
        toFloorNumber: number
    ) => {
        const memoizedPermutatedBuildingSet =
            memoizedPermutatedBuildingSets.find(
                (memoizedPermutatedBuilding) => {
                    return (
                        memoizedPermutatedBuilding[0][0] === building &&
                        memoizedPermutatedBuilding[0][1] === fromFloorNumber &&
                        memoizedPermutatedBuilding[0][2] === toFloorNumber
                    );
                }
            );
        if (undefined !== memoizedPermutatedBuildingSet) {
            return memoizedPermutatedBuildingSet[1];
        }
        const buildingPermutations: Building[] = [];
        const fromFloor = building.getFloors().get(fromFloorNumber);
        if (undefined === fromFloor) {
            throw new Error(
                `Unable to get fromFloor with fromFloorNumber ${fromFloorNumber}`
            );
        }
        const fromFloorItems = [...fromFloor];
        const toFloor = building.getFloors().get(toFloorNumber);
        if (undefined === toFloor) {
            throw new Error(
                `Unable to get toFloor with toFloorNumber ${toFloorNumber}`
            );
        }
        for (let i = 0; i < fromFloorItems.length; i++) {
            const newBuildingI = building.copy();
            newBuildingI.moveItemsFromFloorNumberToFloorNumber(
                fromFloorNumber,
                toFloorNumber,
                new ItemSetConcrete([fromFloorItems[i]])
            );
            buildingPermutations.push(getMemoizedBuilding(newBuildingI));
            for (let j = 0; j < fromFloorItems.length; j++) {
                if (i === j) {
                    continue;
                }
                const newBuildingIJ = building.copy();
                newBuildingIJ.moveItemsFromFloorNumberToFloorNumber(
                    fromFloorNumber,
                    toFloorNumber,
                    new ItemSetConcrete([fromFloorItems[i], fromFloorItems[j]])
                );
                buildingPermutations.push(getMemoizedBuilding(newBuildingIJ));
            }
        }
        memoizedPermutatedBuildingSets.push([
            [building, fromFloorNumber, toFloorNumber],
            buildingPermutations,
        ]);
        return buildingPermutations;
    };
}

export class BTreeKeyBuilding implements BTreeKeyInterface<string, Building> {
    private building: Building;
    private key: string;
    constructor(building: Building) {
        this.building = building;
        this.key = JSON.stringify(this.building);
    }
    getKey() {
        return this.key;
    }
    getValue() {
        return this.building;
    }
}

// BFS - Breadth First Search
export function findShortestPathToSuccess(building: Building) {
    let queue: [Building, Building[]][] = [[building, [building]]];
    const visited: BTreeInterface<string, Building> = new BTree();
    let visitedSize = 0;
    visited.insert(new BTreeKeyBuilding(building));
    const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
        getPermutatedBuildingsFromFloorToFloor:
            getFunctionGetPermutatedBuildingsFromFloorToFloor({
                getMemoizedBuilding: getFunctionGetMemoizedBuilding([building]),
            }),
    });
    while (queue.length > 0) {
        // queue = sortQueueByPathLengthAndUpperFloorConcentrationScore(queue);
        // console.log(`visited: ${visited.size}. queue: ${queue.length}`);
        const queueItem = queue.shift();
        if (queueItem === undefined) {
            throw new Error(`queueItem is undefined`);
        }
        const [node, path] = queueItem;
        console.log(
            `visited: ${visitedSize}. queue: ${queue.length}. path: ${path.length}`
        );
        // console.log(JSON.stringify(node, null, 2));
        // console.time('getPermutatedBuildings');
        // const permutations = sortBuildingsByUpperFloorConcentration(
        //     getPermutatedBuildings(node)
        // );

        const permutations = getPermutatedBuildings(node);

        // console.timeEnd('getPermutatedBuildings');
        for (const permutation of permutations) {
            const permutationBTreeKey = new BTreeKeyBuilding(permutation);
            if (visited.contains(permutationBTreeKey)) {
                // console.log(`Found visited`);
                continue;
            }
            visited.insert(permutationBTreeKey);
            visitedSize++;
            // console.log(JSON.stringify(visited, null, 2));
            if (success(permutation)) {
                return [...path, permutation];
            }
            if (failure(permutation)) {
                continue;
            }
            queue.push([permutation, [...path, permutation]]);
        }
    }
    return null;
}

export class CommandParser {
    private building: Building;
    private floorNumber: number;
    constructor(building: Building) {
        this.building = building;
        this.floorNumber = 1;
    }
    public isValidItemType(type: any): type is ItemType {
        return type === 'generator' || type === 'microchip';
    }
    public execute(commandString: string) {
        const command = commandString.trim();
        const floor = new ItemSetConcrete();
        let itemRegex =
            /a (?<element>[a-zA-Z]+)(?:-compatible)? (?<type>generator|microchip+)/g;
        let item: undefined | null | RegExpExecArray = undefined;
        while ((item = itemRegex.exec(command)) !== null) {
            if (item.groups?.element === undefined) {
                throw new Error(`Unable to parse element from command`);
            }
            if (!this.isValidItemType(item.groups?.type)) {
                throw new Error(`Unable to parse type from command`);
            }

            floor.addItem(
                new ItemConcrete(item.groups?.element, item.groups?.type)
            );
        }
        this.building.getFloors().set(this.floorNumber, floor);
        this.floorNumber++;
    }
}
