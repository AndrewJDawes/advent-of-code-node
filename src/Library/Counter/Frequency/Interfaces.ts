export interface CounterFrequencyPositional<T>
    extends Iterable<Map<T, number>> {
    add(index: number, value: T): void;
}
