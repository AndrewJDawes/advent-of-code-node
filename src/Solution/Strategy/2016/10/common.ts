type BotMicrochipComparisonEvent = {
    type: 'BotMicrochipComparisonEvent';
    payload: {
        microchips: number[];
    };
};
type BotAddNewMicrochipEvent = {
    type: 'BotAddNewMicrochipEvent';
    payload: {
        microchips: number[];
    };
};

type BotEvents = {
    BotMicrochipComparisonEvent: BotMicrochipComparisonEvent;
    BotAddNewMicrochipEvent: BotAddNewMicrochipEvent;
};

// Event handler type
type BotEventHandler<K extends keyof BotEvents> = (event: BotEvents[K]) => void;

// A class to store handlers by event key with perfect typing
class BotEventHandlerMap {
    private map = new Map<keyof BotEvents, BotEventHandler<any>[]>();

    // Add handler for event type K
    add<K extends keyof BotEvents>(type: K, handler: BotEventHandler<K>) {
        if (!this.map.has(type)) {
            this.map.set(type, []);
        }
        // TS requires a cast here, but usage is safe:
        (this.map.get(type) as BotEventHandler<K>[]).push(handler);
    }

    // Get handlers for event type K
    get<K extends keyof BotEvents>(type: K): BotEventHandler<K>[] {
        return (this.map.get(type) ?? []) as BotEventHandler<K>[];
    }
}

interface BotProps {
    maxMicrochips?: number;
    microchips?: number[];
    handlers?: BotEventHandlerMap;
}

export class Bot {
    private maxMicrochips: number;
    private microchips: number[];
    private handlers: BotEventHandlerMap;

    constructor({
        maxMicrochips = 2,
        microchips = [],
        handlers = new BotEventHandlerMap(),
    }: BotProps) {
        this.maxMicrochips = maxMicrochips;
        this.microchips = microchips;
        this.handlers = handlers;
    }

    addEventHandler<K extends keyof BotEvents>(
        type: K,
        handler: BotEventHandler<K>
    ) {
        this.handlers.add(type, handler);
    }

    emit<K extends keyof BotEvents>(type: K, event: BotEvents[K]) {
        this.handlers.get(type).forEach((handler) => handler(event));
    }

    addMicrochip(microchip: number) {}

    compareAndReturnHighAndLowMicrochips() {
        let lowValue: number | null = null;
        let lowIndex: number | null = null;
        let highValue: number | null = null;
        let highIndex: number | null = null;

        this.microchips.forEach((item, index) => {
            if (null === lowValue || item < lowValue) {
                lowValue = item;
                lowIndex = index;
            }
            if (null === highValue || item > highValue) {
                highValue = item;
                highIndex = item;
            }
        });
        if (null !== lowIndex) {
            this.microchips.splice(lowIndex, 1);
        }
        if (null !== highIndex && highIndex !== lowIndex) {
            this.microchips.splice(highIndex, 1);
        }
        return {
            lowValue,
            highValue,
        };
    }
}
