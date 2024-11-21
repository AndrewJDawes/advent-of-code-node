import {
    NumericGridNavigator,
    NumericGridProperties,
    OutOfBoundsException,
    Position,
} from '../Interfaces.js';

class C1 implements NumericGridNavigator {
    gridProperties: NumericGridProperties;
    currentPosition: Position;
    constructor(
        gridProperties: NumericGridProperties,
        currentPosition: Position
    ) {
        this.gridProperties = gridProperties;
        this.currentPosition = currentPosition;
    }
    getRowStartNumber(rowNumber: number): number {
        if (rowNumber + 1 > this.gridProperties.height) {
            throw new Error(`Exceeded number of rows`);
        }
        return (
            rowNumber * this.gridProperties.width * this.gridProperties.step +
            this.gridProperties.start
        );
    }
    getRowEndNumber(rowNumber: number): number {
        if (rowNumber + 1 > this.gridProperties.height) {
            throw new Error(`Exceeded number of rows`);
        }
        return (
            this.gridProperties.start +
            this.gridProperties.width *
                this.gridProperties.step *
                (rowNumber + 1) -
            this.gridProperties.step
        );
    }
    move(deltaPosition: Position): void {
        const newPosition: Position = {
            rowNumber: this.currentPosition.rowNumber + deltaPosition.rowNumber,
            columnNumber:
                this.currentPosition.columnNumber + deltaPosition.columnNumber,
        };
        if (
            newPosition.columnNumber > this.gridProperties.width - 1 ||
            newPosition.columnNumber < 0
        ) {
            throw new OutOfBoundsException('Column number out of bounds');
        }
        if (
            newPosition.rowNumber > this.gridProperties.height - 1 ||
            newPosition.rowNumber < 0
        ) {
            throw new OutOfBoundsException('Row number out of bounds');
        }
        this.currentPosition = newPosition;
    }
    getCurrentPosition(): Position {
        return this.currentPosition;
    }
    getPositionValue(position: Position): number {
        return (
            this.getRowStartNumber(position.rowNumber) +
            position.columnNumber * this.gridProperties.step
        );
    }
    getCurrentPositionValue(): number {
        return this.getPositionValue(this.currentPosition);
    }
}
export default C1;
