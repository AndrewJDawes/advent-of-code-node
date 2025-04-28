import { Result, ResultsArray } from './aInterfaces.js';

export function addItemToResults(results: ResultsArray, result: Result) {
    results.push(result);
    results.sort((a, b) => {
        return a.counter - b.counter;
    });
    return results;
}
