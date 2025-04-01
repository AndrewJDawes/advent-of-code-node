import { Direction, Position } from './Interfaces.js';

export function directionToDeltaPosition(direction: Direction): Position {
    switch (direction) {
        case Direction.U: {
            return {
                rowNumber: -1,
                columnNumber: 0,
            };
        }
        case Direction.R: {
            return {
                rowNumber: 0,
                columnNumber: 1,
            };
        }
        case Direction.D: {
            return {
                rowNumber: 1,
                columnNumber: 0,
            };
        }
        case Direction.L: {
            return {
                rowNumber: 0,
                columnNumber: -1,
            };
        }
    }
}
