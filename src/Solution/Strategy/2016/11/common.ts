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
        const arr = [...this.items];
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
            for (const itemB of itemSetBCopy) {
                if (itemA.equals(itemB)) {
                    itemSetBCopy.deleteItem(itemB);
                } else {
                    differenceSet.addItem(itemA);
                }
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
    }
}

export type SolutionState = 'success' | 'failure' | 'enroute';
export class SolutionPath {
    private building: Building;
    private explored: boolean;
    private state: SolutionState | null;
    private permutatedSolutionPaths: SolutionPath[] | null;
    private getPermutatedBuildings: (building: Building) => Building[];
    private getSolutionPathByBuilding: (building: Building) => SolutionPath;
    private onExploredChangeCallbacks: Map<
        SolutionPath,
        (solutionPath: SolutionPath) => void
    >;
    constructor({
        building,
        getPermutatedBuildings,
        getSolutionPathByBuilding,
    }: {
        building: Building;
        getPermutatedBuildings: (building: Building) => Building[];
        getSolutionPathByBuilding: (building: Building) => SolutionPath;
    }) {
        this.building = building;
        this.explored = false;
        this.state = null;
        this.getPermutatedBuildings = getPermutatedBuildings;
        this.getSolutionPathByBuilding = getSolutionPathByBuilding;
        this.onExploredChangeCallbacks = new Map();
        this.permutatedSolutionPaths = null;
    }
    getBuilding() {
        return this.building;
    }
    setExplored(explored: boolean) {
        if (explored !== this.explored) {
            this.explored = explored;
            this.onExploredChangeCallbacks.forEach((callback) => {
                callback(this);
            });
        }
    }
    registerExploredChangeObserver(
        solutionPath: SolutionPath,
        onExploredChangeCallback: (solutionPath: SolutionPath) => void
    ) {
        if (undefined === this.onExploredChangeCallbacks.get(solutionPath)) {
            this.onExploredChangeCallbacks.set(
                solutionPath,
                onExploredChangeCallback
            );
        }
    }
    isExplored(): boolean {
        return this.explored;
    }
    recheckExplored() {
        this.setExplored(
            this.state === 'success' ||
                this.state === 'failure' ||
                (this.state === 'enroute' &&
                    this.permutatedSolutionPaths !== null &&
                    this.permutatedSolutionPaths.every(
                        (permutatedSolutionPath) =>
                            permutatedSolutionPath.isExplored()
                    ))
        );
    }
    getState() {
        return this.state;
    }
    getPermutatedSolutionPaths() {
        return this.permutatedSolutionPaths;
    }
    solve(fromPath: SolutionPath[], solutionData: SolutionData) {
        // loopback
        if (
            undefined !==
            fromPath.find((existingMemoizedSolutionPath) => {
                return existingMemoizedSolutionPath
                    .getBuilding()
                    .equals(this.building);
            })
        ) {
            return;
        }
        // better known solution
        if (
            null !== solutionData.minKnownSolutionPath &&
            solutionData.minKnownSolutionPath.length <= fromPath.length + 1
        ) {
            return;
        }
        if (failure(this.building)) {
            this.setExplored(true);
            this.state = 'failure';
            return;
        }
        if (success(this.building)) {
            this.setExplored(true);
            this.state = 'success';
            solutionData.minKnownSolutionPath = [...fromPath, this];
            return;
        }
        this.state = 'enroute';
        const permutatedBuildings = this.getPermutatedBuildings(this.building);
        this.permutatedSolutionPaths = permutatedBuildings.map((building) => {
            const solutionPath = this.getSolutionPathByBuilding(building);
            solutionPath.registerExploredChangeObserver(
                this,
                (changedSolutionPath) => this.recheckExplored()
            );
            return solutionPath;
        });
        // attempt to solve any previously unsolved
        this.permutatedSolutionPaths
            .filter(
                (permutatedSolutionPath) => !permutatedSolutionPath.isExplored()
            )
            .forEach((permutatedSolutionPath) =>
                permutatedSolutionPath.solve([...fromPath, this], solutionData)
            );
    }
}

export class SolutionPathConcreteFactoryConcrete {
    private getPermutatedBuildings: (building: Building) => Building[];
    private getSolutionPathByBuilding: (building: Building) => SolutionPath;
    constructor() {
        this.getPermutatedBuildings = getMemoizedPermutatedBuildings({
            getPermutatedBuildingsFromFloorToFloor:
                getMemoizedPermutatedBuildingsFromFloorToFloor(),
        });
        this.getSolutionPathByBuilding = getMemoizedSolutionPathByBuilding({
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
    if (building.getElevatorFloorNumber() !== 4) {
        return false;
    }
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

export function getMemoizedSolutionPathByBuilding({
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

// TODO: Memoize
export function getMemoizedPermutatedBuildings({
    getPermutatedBuildingsFromFloorToFloor,
}: {
    getPermutatedBuildingsFromFloorToFloor: (
        building: Building,
        fromFloorNumber: number,
        toFloorNumber: number
    ) => Building[];
}) {
    return (building: Building) => {
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
        if (targetFloorIndexA > 0) {
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
        return buildingPermutations;
    };
}

// TODO: Memoize
export function getMemoizedPermutatedBuildingsFromFloorToFloor() {
    return (
        building: Building,
        fromFloorNumber: number,
        toFloorNumber: number
    ) => {
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
            buildingPermutations.push(newBuildingI);
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
                buildingPermutations.push(newBuildingIJ);
            }
        }
        return buildingPermutations;
    };
}

export interface SolutionData {
    minKnownSolutionPath: SolutionPath[] | null;
}
export function getStarterSolutionData(): SolutionData {
    return { minKnownSolutionPath: null };
}
