export enum Justify {
    Right = 0,
    Left = 1,
}

export enum Direction {
    U = 0,
    R = 1,
    D = 2,
    L = 3,
}
export interface Position {
    rowNumber: number;
    columnNumber: number;
}

export interface Row {
    get(index: number): string | undefined;
    set(index: number, value: string): void;
    has(index: number): boolean;
    length(): number;
    startIndex(): number;
    endIndex(): number;
}

export interface Matrix {
    get(index: number): Row | undefined;
    has(index: number): boolean;
    height(): number;
}

export interface MatrixFactory {
    build(): Matrix;
}

export interface StringGridNavigator {
    move(deltaPosition: Position): void;
    getPositionValue(position: Position): string;
    getCurrentPosition(): Position;
    getCurrentPositionValue(): string;
}

export class OutOfBoundsException extends Error {
    constructor(message: string) {
        super(message); // Pass the message to the parent Error class
        this.name = 'OutOfBoundsException'; // Set the error name
    }
}
export interface NumericGridProperties {
    start: number;
    step: number;
    width: number;
    height: number;
}
export interface NumericGridNavigator {
    getRowStartNumber(rowNumber: number): number;
    getRowEndNumber(rowNumber: number): number;
    move(deltaPosition: Position): void;
    getPositionValue(position: Position): number;
    getCurrentPosition(): Position;
    getCurrentPositionValue(): number;
}
