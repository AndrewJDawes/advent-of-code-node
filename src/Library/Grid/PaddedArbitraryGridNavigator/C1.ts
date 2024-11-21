import { OutOfBoundsException } from '../Interfaces.js';
import { StringGridNavigator, Position, Matrix } from '../Interfaces.js';

class C1 implements StringGridNavigator {
    matrix: Matrix;
    currentPosition: Position;
    constructor(matrix: Matrix, currentPosition: Position) {
        this.matrix = matrix;
        this.currentPosition = currentPosition;
    }
    move(deltaPosition: Position): void {
        const newPosition: Position = {
            rowNumber: this.currentPosition.rowNumber + deltaPosition.rowNumber,
            columnNumber:
                this.currentPosition.columnNumber + deltaPosition.columnNumber,
        };
        if (!this.matrix.has(newPosition.rowNumber)) {
            throw new OutOfBoundsException('Row number out of bounds');
        }
        if (
            !this.matrix
                .get(newPosition.rowNumber)
                ?.has(newPosition.columnNumber)
        ) {
            throw new OutOfBoundsException('Column number out of bounds');
        }
        this.currentPosition = newPosition;
    }
    getCurrentPosition(): Position {
        return this.currentPosition;
    }
    getCurrentPositionValue(): string {
        return this.getPositionValue(this.currentPosition);
    }
    getPositionValue(position: Position): string {
        const value = this.matrix
            .get(position.rowNumber)
            ?.get(position.columnNumber);
        if (undefined === value) {
            throw new Error('Unable to find value at position');
        }
        return value;
    }
}
export default C1;
