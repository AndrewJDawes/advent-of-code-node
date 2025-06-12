type ItemType = 'generator' | 'microchip';
interface Item {
    getElement(): string;
    getType(): ItemType;
    copy(): Item;
    equals(item: Item): boolean;
}
class ItemConcrete implements Item {
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
interface ItemSet extends Iterable<Item> {
    addItem(item: Item): void;
    getItem(item: Item): Item | undefined;
    deleteItem(item: Item): void;
    copy(): ItemSet;
    difference(itemSet: ItemSet): ItemSet;
    equals(itemSet: ItemSet): boolean;
    length(): number;
}

class ItemSetConcrete implements ItemSet {
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
                `Uanble to find existing item! element: ${item.getElement()}, type: ${item.getType()}`
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

interface FloorMap {
    set(floorNumber: number, floor: ItemSet): void;
    get(floorNumber: number): ItemSet | undefined;
    entries(): MapIterator<[number, ItemSet]>;
    equals(floorMap: FloorMap): boolean;
}

class FloorMapConcrete implements FloorMap {
    private floors: Map<number, ItemSet>;
    constructor() {
        this.floors = new Map();
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
}

interface Building {
    getFloors(): FloorMap;
    setFloors(floors: FloorMap): void;
    getElevatorFloorNumber(): number;
    setElevatorFloorNumber(floorNumber: number): void;
    copy(): Building;
    equals(building: Building): boolean;
}
class BuildingConcrete implements Building {
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
        return new BuildingConcrete(this.floors, this.elevatorFloorNumber);
    }
    equals(building: Building) {
        return (
            this.getElevatorFloorNumber() ===
                building.getElevatorFloorNumber() &&
            this.getFloors().equals(building.getFloors())
        );
    }
}
