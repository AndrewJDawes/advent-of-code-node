import assert from 'assert';
import md5 from 'md5';

/*
TODO: Because we can't overwrite previously found results (same index), we have to
- Track pending/outstanding iterations/requests to workers at parent level
- Respond with start/end to the parent level (or just the counter at which result was found)
- Wait at the parent level until all pending/oustanding iterations have died down
- Reconcile at the parent level, always favoring the earlier start/end
*/

import {
    Worker,
    MessageChannel,
    MessagePort,
    isMainThread,
    parentPort,
    TransferListItem,
} from 'worker_threads';
interface State {
    counter: number;
    results: (string | null)[];
}
const input = 'ugkcyxxp';
const batchSize = 500;

if (isMainThread) {
    const worker1 = new Worker(__filename);
    const worker2 = new Worker(__filename);
    const state: State = {
        counter: 0,
        results: Array(8).fill(null),
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
        console.log(`Worker received: ${JSON.stringify(message)}`);
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
                console.log(`Unknown Message Received by Worker: ${message}`);
        }
    });
}

function sendMessageOnPort(
    port: MessagePort,
    message: any,
    transferList?: ReadonlyArray<TransferListItem>
) {
    port.postMessage(message, transferList);
}

function parentHandleMessage(message: any, state: State, worker: Worker) {
    console.log(`Parent received: ${JSON.stringify(message)}`);
    switch (message?.eventType) {
        case 'AssignedPort':
        case 'CompletedWork':
            const stillNull = countOccurrences(state.results, null);
            if (stillNull > 0) {
                const oldStateCounter = state.counter;
                state.counter += batchSize;
                worker.postMessage({
                    eventType: 'AssignWork',
                    data: {
                        input,
                        start: oldStateCounter + 1,
                        end: state.counter,
                        minResults: stillNull,
                    },
                });
            }
            break;
        default:
            break;
    }
}

function solveFromStartToEndOrMinResults(
    input: string,
    start: number,
    end: number,
    minResults: number
) {
    let counter = start;
    let results: string[] = [];
    const pattern = /^[0]{5}([0-7])(.).{25}$/;
    while (counter < end && results.length < minResults) {
        const hashInput = `${input}${counter.toString()}`;
        const hash = md5(hashInput);
        const matches = hash.match(pattern);
        if (matches) {
            if (undefined !== matches[1] && undefined !== matches[2]) {
                const position = parseInt(matches[1]);
                const char = matches[2];
                if (null === results[position]) {
                    results[position] = char;
                }
            }
        }
        counter++;
    }
    return results;
}

function countOccurrences(arr: Array<any>, val: any) {
    return arr.reduce((acc, curr) => {
        if (curr === val) {
            acc++;
        }
        return acc;
    }, 0);
}
