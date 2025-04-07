export interface InputTransformerColumnToRow {
    write(input: string[]): void;
    read(): string[][];
}
