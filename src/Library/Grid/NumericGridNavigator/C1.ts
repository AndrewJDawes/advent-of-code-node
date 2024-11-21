import {
    NumericGridNavigator,
    NumericGridProperties,
    Position,
} from './Interfaces.js';

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
        this.currentPosition = {
            rowNumber: Math.max(
                0,
                Math.min(
                    this.currentPosition.rowNumber + deltaPosition.rowNumber,
                    this.gridProperties.height - 1
                )
            ),
            columnNumber: Math.max(
                0,
                Math.min(
                    this.currentPosition.columnNumber +
                        deltaPosition.columnNumber,
                    this.gridProperties.width - 1
                )
            ),
        };
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
