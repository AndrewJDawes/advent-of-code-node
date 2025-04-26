export interface Result {
    counter: number;
    value: string;
}
export type ResultsMap = Map<number, Result>;
export interface State {
    requests: number;
    counter: number;
    results: ResultsMap;
}
