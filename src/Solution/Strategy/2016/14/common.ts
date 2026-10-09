import md5 from 'md5';

export interface StringCharacterizerFiniteStateMachineInterface {
    isDone(): boolean;
    getLongestStreakForLetter(letter: string): number;
    getLettersWithStreakOrLonger(streak: number): string[];
    advance(): void;
}
export class StringCharacterizerFiniteStateMachineA implements StringCharacterizerFiniteStateMachineInterface {
    protected subject: string;
    protected position: number;
    protected letter: string | null;
    protected currentStreakLength: number;
    protected longestStreakByLetter: Map<string, number>;
    constructor(subject: string) {
        this.subject = subject;
        this.position = 0;
        this.letter = null;
        this.currentStreakLength = 0;
        this.longestStreakByLetter = new Map();
    }
    public isDone(): boolean {
        return this.position >= this.subject.length;
    }
    public getLongestStreakForLetter(letter: string): number {
        const streak = this.longestStreakByLetter.get(letter);
        return streak === undefined ? 0 : streak;
    }
    public getLettersWithStreakOrLonger(streak: number): string[] {
        const lettersAndStreaks: string[] = [];
        for (const [letter, letterStreak] of this.longestStreakByLetter) {
            if (letterStreak >= streak) {
                lettersAndStreaks.push(letter);
            }
        }
        return lettersAndStreaks;
    }
    public advance(): void {
        if (this.isDone()) {
            return;
        }
        const newLetter = this.subject[this.position];
        if (newLetter === this.letter) {
            this.currentStreakLength++;
            if (
                this.currentStreakLength >
                this.getLongestStreakForLetter(this.letter)
            ) {
                this.longestStreakByLetter.set(
                    this.letter,
                    this.currentStreakLength,
                );
            }
        } else {
            this.letter = newLetter;
            this.currentStreakLength = 1;
        }
        this.position++;
    }
}

export interface StringCharacterizerFiniteStateMachineFactoryInterface {
    fabricate(subject: string): StringCharacterizerFiniteStateMachineInterface;
}

export class StringCharacterizerFiniteStateMachineFactoryA implements StringCharacterizerFiniteStateMachineFactoryInterface {
    fabricate(subject: string): StringCharacterizerFiniteStateMachineInterface {
        return new StringCharacterizerFiniteStateMachineA(subject);
    }
}

export function generateHash(salt: string, index: number): string {
    return md5(salt + (++index).toString());
}

export interface StringCharacterizerFiniteStateMachineManagerInterface {
    getValueAtIndex(
        index: number,
    ): StringCharacterizerFiniteStateMachineInterface;
}
export class StringCharacterizerFiniteStateMachineManager implements StringCharacterizerFiniteStateMachineManagerInterface {
    salt: string;
    generateHash: (salt: string, index: number) => string;
    stringCharacterizerFiniteStateMachineFactory: StringCharacterizerFiniteStateMachineFactoryInterface;
    stringCharacterizerFiniteStateMachines: StringCharacterizerFiniteStateMachineInterface[];
    constructor(
        salt: string,
        generateHash: (salt: string, index: number) => string,
        stringCharacterizerFiniteStateMachineFactory: StringCharacterizerFiniteStateMachineFactoryInterface,
    ) {
        this.salt = salt;
        this.generateHash = generateHash;
        this.stringCharacterizerFiniteStateMachineFactory =
            stringCharacterizerFiniteStateMachineFactory;
        this.stringCharacterizerFiniteStateMachines = [];
    }
    public getValueAtIndex(
        index: number,
    ): StringCharacterizerFiniteStateMachineInterface {
        if (undefined === this.stringCharacterizerFiniteStateMachines[index]) {
            this.stringCharacterizerFiniteStateMachines[index] ===
                this.stringCharacterizerFiniteStateMachineFactory.fabricate(
                    generateHash(this.salt, index),
                );
        }
        return this.stringCharacterizerFiniteStateMachines[index];
    }
}

export function* generateKey(
    stringCharacterizerFiniteStateMachineManagerInterface: StringCharacterizerFiniteStateMachineManagerInterface,
) {
    let targetStringCharacterizerFiniteStateMachineIndex = 0;
    const targetStreakMinimum = 3;
    const dependentsStreakMinimum = 5;
    while (true) {
        let valid: boolean = false;
        while (false === valid) {
            const targetStringCharacterizerFiniteStateMachine =
                stringCharacterizerFiniteStateMachineManagerInterface.getValueAtIndex(
                    targetStringCharacterizerFiniteStateMachineIndex,
                );
            let targetLetter: string | null = null;
            while (
                targetLetter === null &&
                !targetStringCharacterizerFiniteStateMachine.isDone()
            ) {
                targetStringCharacterizerFiniteStateMachine.advance();
                const targetStreaks =
                    targetStringCharacterizerFiniteStateMachine.getLettersWithStreakOrLonger(
                        targetStreakMinimum,
                    );
                if (targetStreaks.length > 0) {
                    const lastItem = targetStreaks.at(-1);
                    if (lastItem !== undefined) {
                        targetLetter = lastItem;
                    }
                }
            }
            let dependentIndex: null | number = null;
            // todo find the dependent index or give up if still null after 1000
            targetStringCharacterizerFiniteStateMachineIndex++;
        }
        yield stringCharacterizerFiniteStateMachineManagerInterface.getValueAtIndex(
            targetStringCharacterizerFiniteStateMachineIndex,
        );
    }
}
