import assert from 'assert';
import md5 from 'md5';
import { exit } from 'process';
/*
TODO: Because we can't overwrite previously found results (same index), we have to
- Track pending/outstanding iterations/requests to workers at parent level
- Respond with start/end to the parent level (or just the counter at which result was found)
- Wait at the parent level until all pending/oustanding iterations have died down
- Reconcile at the parent level, always favoring the earlier start/end
*/

import { Worker, isMainThread, parentPort } from 'worker_threads';
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
const input = 'ugkcyxxp';
const outputLength = 8;
const batchSize = 50000;

if (isMainThread) {
    console.time();
    const worker1 = new Worker(__filename);
    const worker2 = new Worker(__filename);
    const state: State = {
        requests: 0,
        counter: 0,
        results: new Map(),
    };

    worker1.on('message', (message) =>
        parentHandleMessage(message, state, worker1)
    );
    worker2.on('message', (message) =>
        parentHandleMessage(message, state, worker2)
    ); // send it through the pre-existing global channel
    worker1.postMessage({ eventType: 'AssignPort' });
    worker2.postMessage({ eventType: 'AssignPort' });

    // while (passwordArray.includes(null)) {

    // }
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
                console.error(`Unknown Message Received by Worker: ${message}`);
        }
    });
}

function parentHandleMessage(message: any, state: State, worker: Worker) {
    switch (message?.eventType) {
        case 'AssignedPort':
            if (!areEnoughResults(state)) {
                assignWork(state, worker);
            }
            break;
        case 'CompletedWork':
            reconcileWork(state, message.data.results);
            if (areEnoughResults(state)) {
                if (!areOutstandingRequests(state)) {
                    console.log({
                        answer: formatResults(state.results),
                    });
                    console.timeEnd();
                    exit();
                }
                // wait for the requests to process
            } else {
                assignWork(state, worker);
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

function getRemainingPositions(results: ResultsMap) {
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

function areEnoughResults(state: State) {
    if (getRemainingPositions(state.results).length) {
        return false;
    }
    return true;
}

function assignWork(state: State, worker: Worker) {
    const oldStateCounter = state.counter;
    state.counter += batchSize;
    worker.postMessage({
        eventType: 'AssignWork',
        data: {
            input,
            start: oldStateCounter + 1,
            end: state.counter,
            minResults: getRemainingPositions(state.results).length,
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
