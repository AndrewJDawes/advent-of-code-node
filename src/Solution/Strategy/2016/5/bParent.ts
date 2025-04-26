import { Worker, isMainThread } from 'worker_threads';
import { addItemToResults } from './bCommon.js';
import { ResultsMap, State } from './bInterfaces.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function solve(
    input: string,
    outputLength: number,
    batchSize: number,
    workerCount: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        if (isMainThread) {
            const workers: Worker[] = [];
            for (let i = 0; i < workerCount; i++) {
                workers.push(new Worker(path.join(__dirname, 'bWorker.js')));
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
                        workers,
                        resolve,
                        reject
                    )
                );
            });
            workers.forEach((worker) => {
                worker.postMessage({ eventType: 'AssignPort' });
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
    workers: Worker[],
    resolve: (value: string) => void,
    reject: (reason?: any) => void
) {
    switch (message?.eventType) {
        case 'AssignedPort':
            if (!areEnoughResults(state.results, outputLength)) {
                assignWork(state, input, batchSize, outputLength, worker);
            }
            break;
        case 'CompletedWork':
            reconcileWork(state, message.data.results);
            if (areEnoughResults(state.results, outputLength)) {
                if (state.requests <= 0) {
                    workers.forEach((worker) => {
                        worker.terminate();
                    });
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
function areEnoughResults(results: ResultsMap, outputLength: number) {
    if (getRemainingPositions(results, outputLength).length) {
        return false;
    }
    return true;
}

function formatResults(results: ResultsMap) {
    return [...results.entries()]
        .sort((a, b) => {
            return a[0] - b[0];
        })
        .map((item) => item[1].value)
        .join('');
}
