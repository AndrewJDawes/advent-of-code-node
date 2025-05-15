export interface PixelMap<T, B> {
    getWidth(): number;
    getHeight(): number;
    getBlank(): B;
    set(x: number, y: number, value: T | B): void;
    get(x: number, y: number): T | B;
    delete(x: number, y: number): void;
}
export interface Controller<T, B> {
    rect(x: number, y: number, width: number, height: number, value: T): void;
    rotateColumn(x: number, degree: number): void;
    rotateRow(y: number, degree: number): void;
}
export interface Display<T, B> {
    print(printChar: string, printBlankChar: string): string;
}
export interface Count<T, B> {
    count(): number;
}

export interface CommandParser<T, B> {
    execute(commandString: string, char: T): void;
}
