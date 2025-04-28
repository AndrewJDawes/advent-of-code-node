import { Worker, isMainThread } from 'worker_threads';
import { addItemToResults } from './aCommon.js';
import { ResultsArray, State } from './aInterfaces.js';
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
                workers.push(new Worker(path.join(__dirname, 'aWorker.js')));
            }
            const state: State = {
                requests: 0,
                counter: 0,
                results: [],
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
                    resolve(
                        formatResults(state.results.slice(0, outputLength))
                    );
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
            minResults: getRemainingPositions(state.results, outputLength),
        },
    });
    state.requests++;
}

function reconcileWork(state: State, newResults: ResultsArray) {
    state.requests--;
    for (const result of newResults) {
        addItemToResults(state.results, result);
    }
}

function getRemainingPositions(results: ResultsArray, outputLength: number) {
    return outputLength - results.length;
}
function areEnoughResults(results: ResultsArray, outputLength: number) {
    if (getRemainingPositions(results, outputLength)) {
        return false;
    }
    return true;
}

function formatResults(results: ResultsArray) {
    return results.map((result) => result.value).join('');
}
