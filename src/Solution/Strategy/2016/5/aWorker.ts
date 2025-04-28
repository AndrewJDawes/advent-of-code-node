import md5 from 'md5';
import { parentPort } from 'worker_threads';
import { ResultsArray } from './aInterfaces.js';
import { addItemToResults } from './aCommon.js';
// receive the custom channel info from the parent thread
if (parentPort) {
    // receive the custom channel info from the parent thread
    parentPort.on('message', (message) => {
        childHandleMessage(message);
    });
}

function childHandleMessage(message: any) {
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
}

function solveFromStartToEndOrMinResults(
    input: string,
    start: number,
    end: number,
    minResults: number
) {
    let counter = start;
    let results: ResultsArray = [];
    const pattern = /^[0]{5}(.).{26}$/;
    while (counter < end && results.length < minResults) {
        const hashInput = `${input}${counter.toString()}`;
        const hash = md5(hashInput);
        const matches = hash.match(pattern);
        if (matches) {
            const value = matches.pop();
            if (value) {
                addItemToResults(results, { counter, value });
            }
        }
        counter++;
    }
    return results;
}
