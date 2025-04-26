import { Result, ResultsMap } from './bInterfaces.js';

export function addItemToResults(
    resultsMap: ResultsMap,
    position: number,
    result: Result
) {
    const existingResult = resultsMap.get(position);
    if (
        undefined === existingResult ||
        (undefined !== existingResult &&
            result.counter < existingResult.counter)
    ) {
        resultsMap.set(position, result);
    }
    return resultsMap;
}
