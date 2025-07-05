// import { BTree, BTreeInterface, BTreeKeyInterface } from './btree.js';

import { BTree } from '@umerx/btreejs';
import {
    BTreeInterface,
    BTree as BTreeComplex,
    BTreeKeyInterface,
} from './btree.js';
import { CONNREFUSED } from 'dns';

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
        this.items.sort(sortItems);
    }
    addItem(item: Item) {
        if (undefined !== this.getItem(item)) {
            throw new Error(
                `Item with element ${item.getElement()} and type ${item.getType()} already exists`
            );
        }
        this.items.push(item);
        this.items.sort(sortItems);
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

export function sortItems(a: Item, b: Item) {
    const aString = `${a.getElement()}${a.getType()}`;
    const bString = `${b.getElement()}${b.getType()}`;
    if (aString === bString) {
        return 0;
    }
    return aString < bString ? -1 : 1;
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

export function getFunctionGetPermutatedBuildings({
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
        return buildingPermutations;
    };
}

export function getFunctionGetMemoizedBuilding() {
    return function getMemoizedBuilding(building: Building) {
        return building;
    };
}

export function getFunctionGetPermutatedBuildingsFromFloorToFloor({
    getMemoizedBuilding,
}: {
    getMemoizedBuilding: (building: Building) => Building;
}) {
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
        return buildingPermutations;
    };
}

export class BTreeKeyBuilding implements BTreeKeyInterface<string, Building> {
    private building: Building;
    private key: string;
    constructor(building: Building) {
        this.building = building;
        this.key = canonicalizeBuilding(this.building);
    }
    getKey() {
        return this.key;
    }
    getValue() {
        return this.building;
    }
}

function getFunctionInternCanonicalizedBuilding(
    map: Map<string, string> = new Map()
) {
    return function internCanonicalizedBuilding(buildingString: string) {
        if (!map.has(buildingString)) {
            map.set(buildingString, buildingString);
        }
        const result = map.get(buildingString);
        if (result === undefined) {
            throw new Error(
                `Unable to find buildingString after setting in map`
            );
        }
        return result;
    };
}

const internCanonicalizedBuilding = getFunctionInternCanonicalizedBuilding();

export function canonicalizeBuilding(building: Building) {
    const floors = building.getFloors();
    const canonicalizedBuilding = `[${building.getElevatorFloorNumber()}]${[
        ...floors.entries(),
    ]
        .map(([number, itemSet]) => {
            return `${number}:${[...itemSet]
                .sort(sortItems)
                .map((item) => {
                    return `${item.getElement()}-${item.getType()}`;
                })
                .join(',')}`;
        })
        .join('|')}`;
    return internCanonicalizedBuilding(canonicalizedBuilding);
}

// [1]1:H-microchip,L-microchip|2:H-generator|3:L-generator|4:
export function decanonicalizeBuilding(commandString: string) {
    const building = new BuildingConcrete();
    const command = commandString.trim();
    // First, extract the elevator and remaining contents
    let elevatorRegex = /^\[(?<elevatorNumber>[\d]+)\](?<remainder>.*)$/;
    const elevatorResults = elevatorRegex.exec(command);
    if (null === elevatorResults || undefined === elevatorResults.groups) {
        throw new Error(
            `Unable to parse elevatorResults from ${commandString}`
        );
    }
    if (null === elevatorResults.groups?.elevatorNumber) {
        throw new Error(`Unable to parse elevatorNumber from ${commandString}`);
    }
    if (!Number.isInteger(parseInt(elevatorResults.groups.elevatorNumber))) {
        throw new Error(
            `elevatorNumber must be integer: ${elevatorResults.groups.elevatorNumber}`
        );
    }
    const elevatorNumber = parseInt(elevatorResults.groups.elevatorNumber);
    building.setElevatorFloorNumber(elevatorNumber);
    // Then, extract the remainder and the floors
    if (null === elevatorResults.groups?.remainder) {
        throw new Error(`Unable to parse remainder from ${commandString}`);
    }
    const elevatorRemainder = elevatorResults.groups.remainder;
    const floorsSplit = elevatorRemainder.split('|');
    for (const floorSplit of floorsSplit) {
        const floor = new ItemSetConcrete();
        const floorRegex = /^(?<floorNumber>[\d]+):(?<remainder>.*)$/g;
        const floorResults = floorRegex.exec(floorSplit);
        if (null === floorResults || undefined === floorResults.groups) {
            throw new Error(`Unable to parse floorResults from ${floorSplit}`);
        }
        if (null === floorResults.groups?.floorNumber) {
            throw new Error(
                `Unable to parse floorNumber from ${commandString}`
            );
        }
        if (!Number.isInteger(parseInt(floorResults.groups.floorNumber))) {
            throw new Error(
                `floorNumber must be integer: ${floorResults.groups.floorNumber}`
            );
        }
        const floorNumber = parseInt(floorResults.groups.floorNumber);
        if (null === floorResults.groups?.remainder) {
            throw new Error(`Unable to parse remainder from ${commandString}`);
        }
        const floorResultsRemainder = floorResults.groups.remainder;
        // [1]1:H-microchip,L-microchip|2:H-generator|3:L-generator|4:
        let itemRegex = /(?<element>[a-zA-Z]+)-(?<type>generator|microchip)/g;
        let item: undefined | null | RegExpExecArray = undefined;
        while ((item = itemRegex.exec(floorResultsRemainder)) !== null) {
            if (item.groups?.element === undefined) {
                throw new Error(
                    `Unable to parse element from floorResultsRemainder: ${floorResultsRemainder}`
                );
            }
            if (!isValidItemType(item.groups?.type)) {
                throw new Error(
                    `Unable to parse type from floorResultsRemainder: ${floorResultsRemainder}`
                );
            }
            floor.addItem(
                new ItemConcrete(item.groups?.element, item.groups?.type)
            );
        }
        building.getFloors().set(floorNumber, floor);
    }
    return building;
}

// BFS - Breadth First Search
export function findShortestPathToSuccess(building: Building) {
    const buildingCanonicalized = canonicalizeBuilding(building);
    let queue: [string, string[]][] = [
        [buildingCanonicalized, [buildingCanonicalized]],
    ];
    const visited = new BTree<string>();
    let visitedSize = 0;
    visited.insert(buildingCanonicalized);
    const getPermutatedBuildings = getFunctionGetPermutatedBuildings({
        getPermutatedBuildingsFromFloorToFloor:
            getFunctionGetPermutatedBuildingsFromFloorToFloor({
                getMemoizedBuilding: getFunctionGetMemoizedBuilding(),
            }),
    });
    while (queue.length > 0) {
        const queueItem = queue.shift();
        if (queueItem === undefined) {
            throw new Error(`queueItem is undefined`);
        }
        const [nodeCanonicalized, path] = queueItem;
        console.log(
            `visited: ${visitedSize}. queue: ${queue.length}. path: ${path.length}`
        );

        const permutations = getPermutatedBuildings(
            decanonicalizeBuilding(nodeCanonicalized)
        );

        for (const permutation of permutations) {
            const permutationBTreeKey = canonicalizeBuilding(permutation);
            if (visited.contains(permutationBTreeKey)) {
                continue;
            }
            visited.insert(permutationBTreeKey);
            visitedSize++;
            if (success(permutation)) {
                return [...path, permutation];
            }
            if (failure(permutation)) {
                continue;
            }
            queue.push([permutationBTreeKey, [...path, permutationBTreeKey]]);
        }
    }
    return null;
}

export function isValidItemType(type: any): type is ItemType {
    return type === 'generator' || type === 'microchip';
}

export class CommandParser {
    private building: Building;
    private floorNumber: number;
    constructor(building: Building) {
        this.building = building;
        this.floorNumber = 1;
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
            if (!isValidItemType(item.groups?.type)) {
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
