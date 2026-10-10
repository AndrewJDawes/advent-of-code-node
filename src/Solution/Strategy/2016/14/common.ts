import md5 from 'md5';

export interface StringCharacterizerFiniteStateMachineInterface {
    isDone(): boolean;
    getLongestStreakForLetter(letter: string): number;
    getLettersWithStreakOrLonger(streak: number): string[];
    advance(): void;
    getSubject(): string;
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
    public getSubject(): string {
        return this.subject;
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

export function findFirstLetterWithStreakOrLonger(
    stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
    streakMinimum: number = 3,
) {
    let letter: string | null = null;
    while (letter === null && !stringCharacterizerFiniteStateMachine.isDone()) {
        stringCharacterizerFiniteStateMachine.advance();
        const streaks =
            stringCharacterizerFiniteStateMachine.getLettersWithStreakOrLonger(
                streakMinimum,
            );
        if (streaks.length > 0) {
            const lastItem = streaks.at(-1);
            if (lastItem !== undefined) {
                letter = lastItem;
            }
        }
    }
    return letter;
}

export function hasStreakOrLongerForLetter(
    stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
    targetLetter: string,
    streakMinimum: number = 5,
) {
    let exists: boolean = false;
    let streak = 0;
    while (false == exists && !stringCharacterizerFiniteStateMachine.isDone()) {
        stringCharacterizerFiniteStateMachine.advance();
        streak =
            stringCharacterizerFiniteStateMachine.getLongestStreakForLetter(
                targetLetter,
            );
        if (streak >= streakMinimum) {
            exists = true;
        }
    }
    return exists;
}

export function rangeContainsStreakOrLongerForLetter(
    stringCharacterizerFiniteStateMachineManager: StringCharacterizerFiniteStateMachineManagerInterface,
    startIndex: number,
    exclusiveEndIndex: number,
    targetLetter: string,
    streakMinimum: number = 5,
) {
    let exists: boolean = false;
    while (false == exists && startIndex < exclusiveEndIndex) {
        const dependentStringCharacterizerFiniteStateMachine =
            stringCharacterizerFiniteStateMachineManager.getValueAtIndex(
                startIndex,
            );
        exists = hasStreakOrLongerForLetter(
            dependentStringCharacterizerFiniteStateMachine,
            targetLetter,
            streakMinimum,
        );
        startIndex++;
    }
    return exists;
}

export function* generateKey(
    stringCharacterizerFiniteStateMachineManager: StringCharacterizerFiniteStateMachineManagerInterface,
    startIndex: number = 0,
    targetStreakMinimum: number = 3,
    dependentStreakMinimum: number = 5,
    dependentsConsidered: number = 1000,
) {
    while (true) {
        let key: StringCharacterizerFiniteStateMachineInterface | null = null;
        while (null === key) {
            const targetStringCharacterizerFiniteStateMachine =
                stringCharacterizerFiniteStateMachineManager.getValueAtIndex(
                    startIndex,
                );
            let targetLetter: string | null = findFirstLetterWithStreakOrLonger(
                targetStringCharacterizerFiniteStateMachine,
                targetStreakMinimum,
            );
            if (targetLetter !== null) {
                let dependentFound: boolean = false;
                let dependentStringCharacterizerFiniteStateMachineIndex =
                    startIndex + 1;
                const dependentStringCharacterizerFiniteStateMachineIndexMaxBoundary =
                    dependentStringCharacterizerFiniteStateMachineIndex +
                    dependentsConsidered;
                dependentFound = rangeContainsStreakOrLongerForLetter(
                    stringCharacterizerFiniteStateMachineManager,
                    dependentStringCharacterizerFiniteStateMachineIndex,
                    dependentStringCharacterizerFiniteStateMachineIndexMaxBoundary,
                    targetLetter,
                    dependentStreakMinimum,
                );
                if (true === dependentFound) {
                    key = targetStringCharacterizerFiniteStateMachine;
                }
            }
            // todo find the dependent index or give up if still null after 1000
            startIndex++;
        }
        yield key.getSubject();
    }
}
