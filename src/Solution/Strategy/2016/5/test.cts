import assert from 'assert';
import { resolveCaa } from 'dns';
import md5 from 'md5';
import { Worker, isMainThread, parentPort } from 'worker_threads';

/*
TODO: Because we can't overwrite previously found results (same index), we have to
- Track pending/outstanding iterations/requests to workers at parent level
- Respond with start/end to the parent level (or just the counter at which result was found)
- Wait at the parent level until all pending/oustanding iterations have died down
- Reconcile at the parent level, always favoring the earlier start/end
*/

interface Result {
    counter: number;
    value: string;
}
type ResultsMap = Map<number, Result>;
interface State {
    requests: number;
    counter: number;
    results: ResultsMap;
}
// const input = 'ugkcyxxp';
// const outputLength = 8;
// const batchSize = 50000;
// const workerCount = 8;
export function solve(
    input: string,
    outputLength: number,
    batchSize: number,
    workerCount: number
) {
    return new Promise((resolve, reject) => {
        if (isMainThread) {
            console.time();
            const workers: Worker[] = [];
            for (let i = 0; i < workerCount; i++) {
                workers.push(new Worker(__filename));
            }
            const state: State = {
                requests: 0,
                counter: 0,
                results: new Map(),
            };
            workers.forEach((worker) => {
                worker.on('message', (message) =>
                    parentHandleMessage(
                        message,
                        state,
                        input,
                        batchSize,
                        outputLength,
                        worker,
                        resolve,
                        reject
                    )
                );
            });
            workers.forEach((worker) => {
                worker.postMessage({ eventType: 'AssignPort' });
            });
        } else if (parentPort) {
            // receive the custom channel info from the parent thread
            parentPort.on('message', (message) => {
                switch (message?.eventType) {
                    case 'AssignPort':
                        parentPort?.postMessage({
                            eventType: 'AssignedPort',
                        });
                        break;
                    case 'AssignWork':
                        const results = solveFromStartToEndOrMinResults(
                            message.data.input,
                            message.data.start,
                            message.data.end,
                            message.data.minResults
                        );
                        parentPort?.postMessage({
                            eventType: 'CompletedWork',
                            data: {
                                results,
                            },
                        });
                        break;
                    default:
                        console.error(
                            `Unknown Message Received by Worker: ${message}`
                        );
                }
            });
        }
    });
}

function parentHandleMessage(
    message: any,
    state: State,
    input: string,
    batchSize: number,
    outputLength: number,
    worker: Worker,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
) {
    switch (message?.eventType) {
        case 'AssignedPort':
            if (!areEnoughResults(state, outputLength)) {
                assignWork(state, input, batchSize, outputLength, worker);
            }
            break;
        case 'CompletedWork':
            reconcileWork(state, message.data.results);
            if (areEnoughResults(state, outputLength)) {
                if (!areOutstandingRequests(state)) {
                    resolve(formatResults(state.results));
                }
                // wait for the requests to process
            } else {
                assignWork(state, input, batchSize, outputLength, worker);
            }
            break;
        default:
            break;
    }
}

function formatResults(results: ResultsMap) {
    return [...results.entries()]
        .sort((a, b) => {
            return a[0] - b[0];
        })
        .map((item) => item[1].value)
        .join('');
}

function reconcileWork(state: State, newResults: ResultsMap) {
    state.requests--;
    for (const [position, result] of newResults.entries()) {
        addItemToResults(state.results, position, result);
    }
}

function getRemainingPositions(results: ResultsMap, outputLength: number) {
    const remainingPositions: number[] = [];
    for (let i = 0; i < outputLength; i++) {
        if (!results.has(i)) {
            remainingPositions.push(i);
        }
    }
    return remainingPositions;
}

function areOutstandingRequests(state: State) {
    if (state.requests > 0) {
        return true;
    }
    return false;
}

function areEnoughResults(state: State, outputLength: number) {
    if (getRemainingPositions(state.results, outputLength).length) {
        return false;
    }
    return true;
}

function assignWork(
    state: State,
    input: string,
    batchSize: number,
    outputLength: number,
    worker: Worker
) {
    const oldStateCounter = state.counter;
    state.counter += batchSize;
    worker.postMessage({
        eventType: 'AssignWork',
        data: {
            input,
            start: oldStateCounter + 1,
            end: state.counter,
            minResults: getRemainingPositions(state.results, outputLength)
                .length,
        },
    });
    state.requests++;
}

function solveFromStartToEndOrMinResults(
    input: string,
    start: number,
    end: number,
    minResults: number
) {
    let counter = start;
    let resultsMap: ResultsMap = new Map();
    const pattern = /^[0]{5}([0-7])(.).{25}$/;
    while (counter < end && [...resultsMap.keys()].length < minResults) {
        const hashInput = `${input}${counter.toString()}`;
        const hash = md5(hashInput);
        const matches = hash.match(pattern);
        if (matches) {
            if (undefined !== matches[1] && undefined !== matches[2]) {
                const position = parseInt(matches[1]);
                const value = matches[2];
                addItemToResults(resultsMap, position, { counter, value });
            }
        }
        counter++;
    }
    return resultsMap;
}

function addItemToResults(
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
