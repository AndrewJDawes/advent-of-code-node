type CollectorMicrochipComparisonEventPayload = {
    microchips: number[];
};
type CollectorAddNewMicrochipEventPayload = {
    microchips: number[];
};

type CollectorEvents = {
    microchipsCompared: CollectorMicrochipComparisonEventPayload;
    microchipAdded: CollectorAddNewMicrochipEventPayload;
};

// Event handler type
type CollectorEventHandler<K extends keyof CollectorEvents> = (
    event: CollectorEvents[K]
) => void;

// A class to store handlers by event key with perfect typing
class CollectorEventHandlerMap {
    private map = new Map<
        keyof CollectorEvents,
        CollectorEventHandler<any>[]
    >();

    // Add handler for event type K
    public add<K extends keyof CollectorEvents>(
        type: K,
        handler: CollectorEventHandler<K>
    ) {
        if (!this.map.has(type)) {
            this.map.set(type, []);
        }
        // TS requires a cast here, but usage is safe:
        (this.map.get(type) as CollectorEventHandler<K>[]).push(handler);
    }

    // Get handlers for event type K
    public get<K extends keyof CollectorEvents>(
        type: K
    ): CollectorEventHandler<K>[] {
        return (this.map.get(type) ?? []) as CollectorEventHandler<K>[];
    }
}

interface CollectorProps {
    maxMicrochips?: number;
    microchips?: number[];
    handlers?: CollectorEventHandlerMap;
}

export class Collector {
    private maxMicrochips: number;
    private microchips: number[];
    private handlers: CollectorEventHandlerMap;

    constructor({
        maxMicrochips = 2,
        microchips = [],
        handlers = new CollectorEventHandlerMap(),
    }: CollectorProps) {
        this.maxMicrochips = maxMicrochips;
        this.microchips = microchips;
        this.handlers = handlers;
    }

    public addEventHandler<K extends keyof CollectorEvents>(
        type: K,
        handler: CollectorEventHandler<K>
    ) {
        this.handlers.add(type, handler);
    }

    public emit<K extends keyof CollectorEvents>(
        type: K,
        event: CollectorEvents[K]
    ) {
        this.handlers.get(type).forEach((handler) => handler(event));
    }

    public addMicrochip(microchip: number) {
        if (this.microchips.length === this.maxMicrochips) {
            throw new Error(
                `Unable to add new microchip: ${microchip}. Collector has reached maxMicrochips: ${this.maxMicrochips}`
            );
        }
        this.microchips.push(microchip);
    }

    public compareAndReturnHighAndLowMicrochips() {
        let lowValue: number | null = null;
        let lowIndex: number | null = null;
        let highValue: number | null = null;
        let highIndex: number | null = null;
        const microchipsCopy = this.microchips.slice();
        for (let index = 0; index < this.microchips.length; index++) {
            let item = this.microchips[index];
            if (null === lowValue || item < lowValue) {
                lowValue = item;
                lowIndex = index;
            }
            if (null === highValue || item > highValue) {
                highValue = item;
                highIndex = item;
            }
        }
        if (null !== lowIndex) {
            this.microchips.splice(lowIndex, 1);
        }
        if (null !== highIndex && highIndex !== lowIndex) {
            this.microchips.splice(highIndex, 1);
        }
        this.emit('microchipsCompared', {
            microchips: microchipsCopy,
        });
        return {
            lowValue,
            highValue,
        };
    }
}

type ControllerBotMicrochipComparisonEventPayload = {
    microchips: number[];
};
type ControllerBotAddNewMicrochipEventPayload = {
    microchips: number[];
};

type ControllerBinAddNewMicrochipEventPayload = {
    microchips: number[];
};

type ControllerEvents = {
    'bot:microchipsCompared': ControllerBotMicrochipComparisonEventPayload;
    'bot:microchipAdded': ControllerBotAddNewMicrochipEventPayload;
    'bin:microchipAdded': ControllerBinAddNewMicrochipEventPayload;
};

// Event handler type
type ControllerEventHandler<K extends keyof ControllerEvents> = (
    event: ControllerEvents[K]
) => void;

// A class to store handlers by event key with perfect typing
class ControllerEventHandlerMap {
    private map = new Map<
        keyof ControllerEvents,
        ControllerEventHandler<any>[]
    >();

    // Add handler for event type K
    public add<K extends keyof ControllerEvents>(
        type: K,
        handler: ControllerEventHandler<K>
    ) {
        if (!this.map.has(type)) {
            this.map.set(type, []);
        }
        // TS requires a cast here, but usage is safe:
        (this.map.get(type) as ControllerEventHandler<K>[]).push(handler);
    }

    // Get handlers for event type K
    public get<K extends keyof ControllerEvents>(
        type: K
    ): ControllerEventHandler<K>[] {
        return (this.map.get(type) ?? []) as ControllerEventHandler<K>[];
    }
}

export interface ControllerProps {
    bots: Map<number, Collector>;
    bins: Map<number, Collector>;
    botMaxMicrochips: number;
    binMaxMicrochips: number;
    handlers: ControllerEventHandlerMap;
}
export class Controller {
    private bots: Map<number, Collector>;
    private bins: Map<number, Collector>;
    private botMaxMicrochips: number;
    private binMaxMicrochips: number;
    private handlers: ControllerEventHandlerMap;

    constructor({
        bots = new Map(),
        bins = new Map(),
        botMaxMicrochips = 2,
        binMaxMicrochips = 1,
        handlers = new ControllerEventHandlerMap(),
    }: ControllerProps) {
        this.bots = bots;
        this.bins = bins;
        this.botMaxMicrochips = botMaxMicrochips;
        this.binMaxMicrochips = binMaxMicrochips;
        this.handlers = handlers;
    }
    public addEventHandler<K extends keyof ControllerEvents>(
        type: K,
        handler: ControllerEventHandler<K>
    ) {
        this.handlers.add(type, handler);
    }
    public emit<K extends keyof ControllerEvents>(
        type: K,
        event: ControllerEvents[K]
    ) {
        this.handlers.get(type).forEach((handler) => handler(event));
    }
    public ensureBot(botId: number) {
        let bot = this.bots.get(botId);
        if (undefined === bot) {
            bot = new Collector({ maxMicrochips: this.botMaxMicrochips });
            bot.addEventHandler('microchipAdded', (event) => {
                this.emit('bot:microchipAdded', event);
            });
            bot.addEventHandler('microchipsCompared', (event) => {
                this.emit('bot:microchipsCompared', event);
            });
            this.bots.set(botId, bot);
        }
        return bot;
    }
    public ensureBin(binId: number) {
        let bin = this.bins.get(binId);
        if (undefined === bin) {
            bin = new Collector({ maxMicrochips: this.binMaxMicrochips });
            bin.addEventHandler('microchipAdded', (event) => {
                this.emit('bin:microchipAdded', event);
            });
            this.bins.set(binId, bin);
        }
        return bin;
    }
    public giveValueToBot(botId: number, value: number) {
        const bot = this.ensureBot(botId);
        bot.addMicrochip(value);
    }
    public transferFromBotToBin(fromBotId: number, toBinId: number) {
        const fromBot = this.ensureBot(fromBotId);
        const toBin = this.ensureBin(toBinId);
        const { highValue, lowValue } =
            fromBot.compareAndReturnHighAndLowMicrochips();
        if (null !== highValue) {
            toBin.addMicrochip(highValue);
        }
        if (null !== lowValue) {
            toBin.addMicrochip(lowValue);
        }
    }
    public transferFromBotToBot(fromBotId: number, toBotId: number) {
        const fromBot = this.ensureBot(fromBotId);
        const toBot = this.ensureBot(toBotId);
        const { highValue, lowValue } =
            fromBot.compareAndReturnHighAndLowMicrochips();
        if (null !== highValue) {
            toBot.addMicrochip(highValue);
        }
        if (null !== lowValue) {
            toBot.addMicrochip(lowValue);
        }
    }
}
export class CommandParser {
    private controller: Controller;
    constructor(controller: Controller) {
        this.controller = controller;
    }
    public execute(commandString: string) {
        const commandArray = commandString
            .split(/\s+/)
            .filter((word) => word !== '');
        const command = commandArray.shift();
        switch (command) {
            case 'value': {
                const dimensions = commandArray.shift();
                if (dimensions === undefined) {
                    throw new Error(
                        `Command rect requires dimensions. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                const dimensionsArray = dimensions.split('x');
                if (dimensionsArray.length !== 2) {
                    throw new Error(
                        `Command rect requires dimensions in format XxY. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                const width = parseInt(dimensionsArray[0]);
                if (isNaN(width)) {
                    throw new Error(
                        `Command rect requires numeric dimensions in format XxY. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                const height = parseInt(dimensionsArray[1]);
                if (isNaN(height)) {
                    throw new Error(
                        `Command rect requires numeric dimensions in format XxY. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                // this.controller.rect(0, 0, width, height, this.value);
                break;
            }
            case 'bot': {
                const dimension = commandArray.shift();
                if (
                    undefined === dimension ||
                    !['row', 'column'].includes(dimension)
                ) {
                    throw new Error(
                        `Command rotate requires indicator of dimension row or column. Received: ${commandString}`
                    );
                }
                const planeIndicator = commandArray.shift();
                if (undefined === planeIndicator) {
                    throw new Error(
                        `Command rotate requires plane indicator in format x|y=n. Received: ${commandString}`
                    );
                }
                const planeArray = planeIndicator.split('=');
                const planeArrayPlane = planeArray[0];
                const planeArrayIndex = parseInt(planeArray[1]);
                if (isNaN(planeArrayIndex)) {
                    throw new Error(
                        `Command rotate requires numeric plane index indicator in format x|y=n. Received: ${commandString}`
                    );
                }
                const byThrowaway = commandArray.shift();
                const degree = commandArray.shift();
                if (undefined === degree) {
                    throw new Error(
                        `Command rotate requires degree. Received ${commandString}`
                    );
                }
                const degreeNumeric = parseInt(degree);
                if (isNaN(degreeNumeric)) {
                    throw new Error(
                        `Command rotate requires numeric degree. Received ${commandString}`
                    );
                }
                switch (dimension) {
                    case 'row': {
                        // this.controller.rotateRow(
                        //     planeArrayIndex,
                        //     degreeNumeric
                        // );
                        break;
                    }
                    case 'column': {
                        // this.controller.rotateColumn(
                        //     planeArrayIndex,
                        //     degreeNumeric
                        // );
                        break;
                    }
                    default: {
                        throw new Error(
                            `Command rotate requires dimension to be row or column. Received: ${commandString}`
                        );
                        break;
                    }
                }
                break;
            }
            default: {
                throw new Error(
                    `Unknown command: ${command}. commandString: ${commandString}`
                );
                break;
            }
        }
    }
}
