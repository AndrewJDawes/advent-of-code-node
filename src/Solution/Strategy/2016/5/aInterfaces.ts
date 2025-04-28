export interface Result {
    counter: number;
    value: string;
}
export type ResultsArray = Result[];
export interface State {
    requests: number;
    counter: number;
    results: ResultsArray;
}
