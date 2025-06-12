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
}

// function itemSetDifference(itemSetA: ItemSet, itemSetB: ItemSet) {
//     const differenceSet = new ItemSetConcrete();
//     const itemListA = [...itemSetA];
//     const itemListB = [...itemSetB];
//     for (let i = 0; i < itemListA.length; i++) {
//         const itemListBCopy = [...itemListB];
//         let removedCount = 0;
//         for (let j = 0; j < itemListBCopy.length; j++) {
//             if (itemsAreEqual(itemListA[i], itemListBCopy[j])) {
//                 itemListB.splice(j - removedCount, 1);
//                 removedCount++;
//             } else {
//                 differenceSet.addItem(itemListA[i]);
//             }
//         }
//     }
//     itemListB.forEach((item) => differenceSet.addItem(item));
//     return differenceSet;
// }

// function itemSetDifferenceOptimized(itemSetA: ItemSet, itemSetB: ItemSet) {
//     const differenceSet = new ItemSetConcrete();
//     const itemSetBCopy = itemSetB.copy();
//     for (const itemA of itemSetA) {
//         for (const itemB of itemSetBCopy) {
//             if (itemsAreEqual(itemA, itemB)) {
//                 itemSetBCopy.deleteItem(itemB);
//             } else {
//                 differenceSet.addItem(itemA);
//             }
//         }
//     }
//     for (const itemB of itemSetBCopy) {
//         differenceSet.addItem(itemB);
//     }
//     return differenceSet;
// }

// function itemSetDifferenceNaive(itemSetA: ItemSet, itemSetB: ItemSet) {
//     const differenceSet = new ItemSetConcrete();
//     for (const itemA of itemSetA) {
//         for (const itemB of itemSetB) {
//             if (!itemsAreEqual(itemA, itemB)) {
//                 differenceSet.addItem(itemA);
//             }
//         }
//     }
//     return differenceSet;
// }

class Floor {
    getItems() {}
    addItem() {}
    deleteItem() {}
}
class Elevator {
    getItems() {}
    addItem() {}
    deleteItem() {}
}
class Building {
    getFloors() {}
    addFloor() {}
    deleteFloor() {}
    getElevator() {}
    addElevator() {}
    deleteElevator() {}
    getElevatorFloor() {}
    setElevatorFloor() {}
}
function getItemsDifference(itemsA: Item[], itemsB: Item[]) {
    const difference: Item[] = [];
    for (const combinedItem of [...itemsA, ...itemsB]) {
        if (
            -1 ===
            itemsA.findIndex(
                (setItem) =>
                    setItem.getElement() === combinedItem.getElement() &&
                    setItem.getType() === combinedItem.getType()
            )
        ) {
            return false;
        }
        if (
            -1 ===
            itemsB.findIndex(
                (setItem) =>
                    setItem.getElement() === combinedItem.getElement() &&
                    setItem.getType() === combinedItem.getType()
            )
        ) {
            return false;
        }
    }
    return true;
}
function buildingsAreSame(buildingA: Building, buildingB: Building) {
    if (!(buildingA.getElevatorFloor() === buildingB.getElevatorFloor())) {
        return false;
    }
    return true;
}
function buildingsAreSameMulti(...buildings: Building[]): boolean {
    return buildings.every((value, index, array) => {});
}
