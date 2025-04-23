const assert = require('assert');

import {
    Worker,
    MessageChannel,
    MessagePort,
    isMainThread,
    parentPort,
    TransferListItem,
} from 'worker_threads';
interface Block {
    version: number;
    start: number;
    stop: number;
    data: string[];
}

if (isMainThread) {
    const blocks: Block[] = [];
    const worker = new Worker(__filename);

    // create a channel in which further messages will be sent
    const subChannel = new MessageChannel();

    // send it through the pre-existing global channel
    worker.postMessage(
        { eventType: 'AssignPort', data: { port: subChannel.port1 } },
        [subChannel.port1]
    );

    // receive messages from the worker thread on the custom channel
    subChannel.port2.on('message', (message) => {
        console.log(`Parent received: ${JSON.stringify(message)}`);
        switch (message?.eventType) {
            case 'AdditionalWorkRequested':
                const maxStop = Math.max(...blocks.map((block) => block.stop));
                const newStart = maxStop + 1;
                blocks.push({
                    version: 0,
                    start: newStart + 1,
                    stop: newStart + 501,
                    data: [],
                });
                sendMessageOnPort(subChannel.port1, {
                    eventType: 'AdditionalWorkAssigned',
                    data: { block: blocks[blocks.length - 1] },
                });
                break;
            default:
                break;
        }
    });

    blocks;
} else if (parentPort) {
    const blocks: Block[] = [];
    let shouldRequestWork = true;
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
                        eventType: 'AssignPortReceived',
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
