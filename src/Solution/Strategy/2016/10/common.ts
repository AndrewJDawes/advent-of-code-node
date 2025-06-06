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
        const command = commandString.trim();

        const patternTransfer =
            /bot\s+(\d+)\s+gives\s+(low|high)\s+to\s+(bot|output)\s+(\d+)\s+and\s+(low|high)\s+to\s+(bot|output)\s+(\d+)/;
        const resultsTransfer = patternTransfer.exec(command);
        if (null !== resultsTransfer) {
            return;
        }

        const patternAdd = /value\s+(\d+)\s+goes\s+to\s+(bot|output)\s+(\d+)/;
        const resultsAdd = patternAdd.exec(command);
        if (null !== resultsAdd) {
            return;
        }
    }
}
