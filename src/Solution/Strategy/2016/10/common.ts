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
export class Collector {
    private maxMicrochips: number;
    private microchips: number[];
    private handlers: CollectorEventHandlerMap;
    private processingQueue: ((collector: Collector) => void)[];
    private minMicrochips: number;
    constructor({
        minMicrochips = 2,
        maxMicrochips = 2,
        microchips = [],
        handlers = new CollectorEventHandlerMap(),
        processingQueue = [],
    }: {
        maxMicrochips?: number;
        minMicrochips?: number;
        microchips?: number[];
        handlers?: CollectorEventHandlerMap;
        processingQueue?: ((collector: Collector) => void)[];
    }) {
        this.minMicrochips = minMicrochips;
        this.maxMicrochips = maxMicrochips;
        this.microchips = microchips;
        this.handlers = handlers;
        this.processingQueue = processingQueue;
    }

    public enqueueProcess(process: (collector: Collector) => void) {
        this.processingQueue.push(process);
        this.processQueue();
    }

    public processQueue() {
        for (const process of this.processingQueue) {
            if (!(this.microchips.length >= this.minMicrochips)) {
                return;
            }
            process(this);
        }
    }

    public getMicrochips() {
        return this.microchips;
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
        this.emit('microchipAdded', {
            microchips: this.microchips,
        });
        this.processQueue();
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
                highIndex = index;
            }
        }
        if (null !== lowIndex) {
            this.microchips.splice(lowIndex, 1);
        }
        if (null !== highIndex && highIndex !== lowIndex) {
            if (null !== lowIndex && lowIndex < highIndex) {
                highIndex--;
            }
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

type ControllerMicrochipComparisonEventPayload = {
    collectorType: CollectorType;
    collectorId: number;
    microchips: number[];
};
type ControllerAddNewMicrochipEventPayload = {
    collectorType: CollectorType;
    collectorId: number;
    microchips: number[];
};

type ControllerEvents = {
    'bot:microchipsCompared': ControllerMicrochipComparisonEventPayload;
    'bot:microchipAdded': ControllerAddNewMicrochipEventPayload;
    'output:microchipAdded': ControllerAddNewMicrochipEventPayload;
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
    bots?: Map<number, Collector>;
    outputs?: Map<number, Collector>;
    botMaxMicrochips?: number;
    outputMaxMicrochips?: number;
    handlers?: ControllerEventHandlerMap;
}

export interface CommandParserControllerInterface {
    giveValue(sinkType: SinkType, sinkId: number, value: number): void;
    transferHighAndLow(props: {
        fromType: SourceType;
        fromId: number;
        highToType: SinkType;
        highToId: number;
        lowToType: SinkType;
        lowToId: number;
    }): void;
}
export class Controller implements CommandParserControllerInterface {
    private bots: Map<number, Collector>;
    private outputs: Map<number, Collector>;
    private botMaxMicrochips: number;
    private outputMaxMicrochips: number;
    private handlers: ControllerEventHandlerMap;

    constructor({
        bots = new Map(),
        outputs = new Map(),
        botMaxMicrochips = 2,
        outputMaxMicrochips = 1,
        handlers = new ControllerEventHandlerMap(),
    }: ControllerProps) {
        this.bots = bots;
        this.outputs = outputs;
        this.botMaxMicrochips = botMaxMicrochips;
        this.outputMaxMicrochips = outputMaxMicrochips;
        this.handlers = handlers;
    }
    public getBots() {
        return this.bots;
    }
    public getOutputs() {
        return this.outputs;
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
                this.emit('bot:microchipAdded', {
                    ...event,
                    collectorId: botId,
                    collectorType: 'bot',
                });
            });
            bot.addEventHandler('microchipsCompared', (event) => {
                this.emit('bot:microchipsCompared', {
                    ...event,
                    collectorId: botId,
                    collectorType: 'bot',
                });
            });
            this.bots.set(botId, bot);
        }
        return bot;
    }
    public ensureOutput(outputId: number) {
        let output = this.outputs.get(outputId);
        if (undefined === output) {
            output = new Collector({ maxMicrochips: this.outputMaxMicrochips });
            output.addEventHandler('microchipAdded', (event) => {
                this.emit('output:microchipAdded', {
                    ...event,
                    collectorId: outputId,
                    collectorType: 'output',
                });
            });
            this.outputs.set(outputId, output);
        }
        return output;
    }
    public giveValue(sinkType: SinkType, sinkId: number, value: number) {
        let sink: Collector | null = null;
        switch (sinkType) {
            case 'output': {
                sink = this.ensureOutput(sinkId);
                break;
            }
            case 'bot': {
                sink = this.ensureBot(sinkId);
                break;
            }
            default: {
                throw new Error(`Invalid sinkType: ${sinkType}`);
            }
        }
        sink.addMicrochip(value);
    }
    public transferHighAndLow({
        fromType,
        fromId,
        highToType,
        highToId,
        lowToType,
        lowToId,
    }: {
        fromType: SourceType;
        fromId: number;
        highToType: SinkType;
        highToId: number;
        lowToType: SinkType;
        lowToId: number;
    }) {
        let source: Collector | null = null;
        let highToSink: Collector | null = null;
        let lowToSink: Collector | null = null;
        switch (fromType) {
            case 'output': {
                source = this.ensureOutput(fromId);
                break;
            }
            case 'bot': {
                source = this.ensureBot(fromId);
                break;
            }
            default: {
                throw new Error(`Invalid fromType: ${fromType}`);
            }
        }
        source.enqueueProcess((collector) => {
            switch (highToType) {
                case 'output': {
                    highToSink = this.ensureOutput(highToId);
                    break;
                }
                case 'bot': {
                    highToSink = this.ensureBot(highToId);
                    break;
                }
                default: {
                    throw new Error(`Invalid highToType: ${highToType}`);
                }
            }
            switch (lowToType) {
                case 'output': {
                    lowToSink = this.ensureOutput(lowToId);
                    break;
                }
                case 'bot': {
                    lowToSink = this.ensureBot(lowToId);
                    break;
                }
                default: {
                    throw new Error(`Invalid lowToType: ${lowToType}`);
                }
            }
            const { highValue, lowValue } =
                collector.compareAndReturnHighAndLowMicrochips();
            if (null !== highValue) {
                highToSink.addMicrochip(highValue);
            }
            if (null !== lowValue) {
                lowToSink.addMicrochip(lowValue);
            }
        });
    }
}

type CollectorType = 'bot' | 'output';
type SinkType = CollectorType;
type SourceType = SinkType;

type OutputType = 'low' | 'high';
type InputType = OutputType;
// TODO: Build a way to transfer high/low to two separate sinks
export class CommandParser {
    private controller: CommandParserControllerInterface;
    constructor(controller: CommandParserControllerInterface) {
        this.controller = controller;
    }
    public isValidSinkType(type: string): type is SinkType {
        return type === 'bot' || type === 'output';
    }
    public isValidSourceType(type: string): type is SourceType {
        return this.isValidSinkType(type);
    }
    public isValidOutputType(type: string): type is OutputType {
        return type === 'low' || type === 'high';
    }
    public isValidInputType(type: string): type is InputType {
        return this.isValidOutputType(type);
    }
    public execute(commandString: string) {
        const command = commandString.trim();
        const resultsAdd =
            /^value\s+(?<value>\d+)\s+goes\s+to\s+(?<sinkType>bot|output)\s+(?<sinkId>\d+)$/.exec(
                command
            );
        if (null !== resultsAdd) {
            const valueRaw = resultsAdd?.groups?.value;
            const sinkTypeRaw = resultsAdd?.groups?.sinkType;
            const sinkIdRaw = resultsAdd?.groups?.sinkId;
            if (undefined === valueRaw) {
                throw new Error(`valueRaw is undefined`);
            }
            const value = parseInt(valueRaw);
            if (isNaN(value)) {
                throw new Error(`value is NaN`);
            }

            if (undefined === sinkTypeRaw) {
                throw new Error(`sinkType is undefined`);
            }

            if (!this.isValidSinkType(sinkTypeRaw)) {
                throw new Error(`Unknown sinkType: ${sinkTypeRaw}`);
            }

            if (undefined === sinkIdRaw) {
                throw new Error(`sinkIdRaw is undefined`);
            }
            const sinkId = parseInt(sinkIdRaw);
            if (isNaN(sinkId)) {
                throw new Error(`sinkId is NaN`);
            }
            this.controller.giveValue(sinkTypeRaw, sinkId, value);
            return;
        }
        const resultsTransfer =
            /^(?<sourceType>bot|output)\s+(?<sourceId>\d+)\s+gives\s+(?<sinkALowOrHigh>low|high)\s+to\s+(?<sinkAType>bot|output)\s+(?<sinkAId>\d+)\s+and\s+(?<sinkBLowOrHigh>low|high)\s+to\s+(?<sinkBType>bot|output)\s+(?<sinkBId>\d+)$/.exec(
                command
            );
        if (null !== resultsTransfer) {
            const sourceTypeRaw = resultsTransfer?.groups?.sourceType;
            const sourceIdRaw = resultsTransfer?.groups?.sourceId;

            const sinkALowOrHighRaw = resultsTransfer?.groups?.sinkALowOrHigh;
            const sinkATypeRaw = resultsTransfer?.groups?.sinkAType;
            const sinkAIdRaw = resultsTransfer?.groups?.sinkAId;
            const sinkBLowOrHighRaw = resultsTransfer?.groups?.sinkBLowOrHigh;
            const sinkBTypeRaw = resultsTransfer?.groups?.sinkBType;
            const sinkBIdRaw = resultsTransfer?.groups?.sinkBId;

            if (undefined === sourceTypeRaw) {
                throw new Error(`sourceType is undefined`);
            }

            if (!this.isValidSourceType(sourceTypeRaw)) {
                throw new Error(`Unknown sourceType: ${sourceTypeRaw}`);
            }

            if (undefined === sourceIdRaw) {
                throw new Error(`sourceIdRaw is undefined`);
            }

            const sourceId = parseInt(sourceIdRaw);

            if (isNaN(sourceId)) {
                throw new Error(`sourceId is NaN`);
            }

            if (undefined === sinkATypeRaw) {
                throw new Error(`sinkAType is undefined`);
            }

            if (!this.isValidSinkType(sinkATypeRaw)) {
                throw new Error(`Unknown sinkAType: ${sinkATypeRaw}`);
            }

            if (undefined === sinkAIdRaw) {
                throw new Error(`sinkAIdRaw is undefined`);
            }

            const sinkAId = parseInt(sinkAIdRaw);

            if (isNaN(sinkAId)) {
                throw new Error(`sinkAId is NaN`);
            }

            if (undefined === sinkALowOrHighRaw) {
                throw new Error(`sinkALowOrHighRaw is undefined`);
            }
            if (!this.isValidOutputType(sinkALowOrHighRaw)) {
                throw new Error(
                    `Unknown sinkALowOrHighRaw: ${sinkALowOrHighRaw}`
                );
            }

            if (undefined === sinkBTypeRaw) {
                throw new Error(`sinkBType is undefined`);
            }

            if (!this.isValidSinkType(sinkBTypeRaw)) {
                throw new Error(`Unknown sinkBType: ${sinkBTypeRaw}`);
            }

            if (undefined === sinkBIdRaw) {
                throw new Error(`sinkBIdRaw is undefined`);
            }

            const sinkBId = parseInt(sinkBIdRaw);

            if (isNaN(sinkBId)) {
                throw new Error(`sinkBId is NaN`);
            }

            if (undefined === sinkBLowOrHighRaw) {
                throw new Error(`sinkBLowOrHighRaw is undefined`);
            }
            if (!this.isValidOutputType(sinkBLowOrHighRaw)) {
                throw new Error(
                    `Unknown sinkBLowOrHighRaw: ${sinkBLowOrHighRaw}`
                );
            }

            if (sinkALowOrHighRaw === sinkBLowOrHighRaw) {
                throw new Error(
                    `Invalid: sinkALowOrHighRaw === sinkBLowOrHighRaw: ${sinkALowOrHighRaw}, ${sinkBLowOrHighRaw}`
                );
            }
            const sinkAIsHigh = sinkALowOrHighRaw === 'high';
            this.controller.transferHighAndLow({
                fromType: sourceTypeRaw,
                fromId: sourceId,
                highToType: sinkAIsHigh ? sinkATypeRaw : sinkBTypeRaw,
                highToId: sinkAIsHigh ? sinkAId : sinkBId,
                lowToType: sinkAIsHigh ? sinkBTypeRaw : sinkATypeRaw,
                lowToId: sinkAIsHigh ? sinkBId : sinkAId,
            });

            return;
        }
        throw new Error(`Unrecognized command: ${command}`);
    }
}

export interface MonitorForResultsController {
    addEventHandler<K extends keyof ControllerEvents>(
        type: K,
        handler: ControllerEventHandler<K>
    ): void;
}
export class MonitorForResultsWatchForComparison {
    private controller: MonitorForResultsController;
    private comparisons: Set<number>;
    private comparerId: number | null;
    private done: boolean;
    constructor({
        controller,
        comparisons,
    }: {
        controller: MonitorForResultsController;
        comparisons: Set<number>;
    }) {
        this.controller = controller;
        this.comparisons = comparisons;
        this.done = false;
        this.comparerId = null;
        this.controller.addEventHandler('bot:microchipsCompared', (event) => {
            const compared = new Set(event.microchips);
            for (const comparison of this.comparisons) {
                if (!compared.has(comparison)) {
                    return;
                }
            }
            this.done = true;
            this.comparerId = event.collectorId;
        });
    }
    public getResults() {
        return this.comparerId;
    }
    public isDone() {
        return this.done;
    }
}
