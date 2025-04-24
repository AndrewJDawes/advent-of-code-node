import assert from 'assert';
import md5 from 'md5';

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

    // create a channel in which further messages will be sent
    const subChannel1 = new MessageChannel();
    const subChannel2 = new MessageChannel();
    // receive messages from the worker thread on the custom channel
    subChannel1.port2.on('message', (message) =>
        parentHandleMessage(message, state, worker1, subChannel1.port1)
    );
    subChannel2.port2.on('message', (message) =>
        parentHandleMessage(message, state, worker2, subChannel2.port1)
    );

    // send it through the pre-existing global channel
    worker1.postMessage(
        { eventType: 'AssignPort', data: { port: subChannel1.port1 } },
        [subChannel1.port1]
    );
    worker2.postMessage(
        { eventType: 'AssignPort', data: { port: subChannel2.port1 } },
        [subChannel2.port1]
    );

    // while (passwordArray.includes(null)) {

    // }
} else if (parentPort) {
    let port: undefined | MessagePort;
    // receive the custom channel info from the parent thread
    parentPort.on('message', (message) => {
        console.log(`Worker received: ${JSON.stringify(message)}`);
        switch (message?.eventType) {
            case 'AssignPort':
                assert(message?.data?.port instanceof MessagePort);
                port = message.data.port;
                if (undefined !== port) {
                    sendMessageOnPort(port, {
                        eventType: 'AssignedPort',
                    });
                }
                break;
            case 'AssignWork':
                assert(message?.data?.input instanceof String);
                assert(message?.data?.start instanceof Number);
                assert(message?.data?.end instanceof Number);
                assert(message?.data?.minResults instanceof Number);
                const results = solveFromStartToEndOrMinResults(
                    message.data.input,
                    message.data.start,
                    message.data.end,
                    message.data.minResults
                );
                if (undefined !== port) {
                    sendMessageOnPort(port, {
                        eventType: 'CompletedWork',
                        data: {
                            results,
                        },
                    });
                }
                break;
            default:
                console.log(`Unknown Message Received by Worker: ${message}`);
        }
        // send a message to the parent thread through the channel
        // message.hereIsYourPort.postMessage('the worker sent this');
        if (undefined !== port) {
            port.close();
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

function parentHandleMessage(
    message: any,
    state: State,
    worker: Worker,
    messagePort: MessagePort
) {
    console.log(`Parent received: ${JSON.stringify(message)}`);
    switch (message?.eventType) {
        case 'AssignedPort':
        case 'CompletedWork':
            const stillNull = countOccurrences(state.results, null);
            if (stillNull > 0) {
                const oldStateCounter = state.counter;
                state.counter += batchSize;
                worker.postMessage(
                    {
                        eventType: 'AssignWork',
                        data: {
                            input,
                            start: oldStateCounter + 1,
                            end: state.counter,
                            minResults: stillNull,
                        },
                    },
                    [messagePort]
                );
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
