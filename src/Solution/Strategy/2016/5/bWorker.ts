import md5 from 'md5';
import { parentPort } from 'worker_threads';
import { ResultsMap } from './bInterfaces.js';
import { addItemToResults } from './bCommon.js';
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
