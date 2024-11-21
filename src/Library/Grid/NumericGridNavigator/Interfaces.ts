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
