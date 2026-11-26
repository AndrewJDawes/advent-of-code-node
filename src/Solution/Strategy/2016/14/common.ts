import md5 from 'md5';
const MEMOIZE: boolean = true;
export interface StringCharacterizerFiniteStateMachineInterface {
    isDone(): boolean;
    getLongestStreakForLetter(letter: string): number;
    getLettersWithStreakOrLonger(streak: number): string[];
    advance(): void;
    getSubject(): string;
}

export type findFirstLetterWithStreakOrLongerType = (
    stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
    streakMinimum?: number,
) => string | null;
export type rangeContainsStreakOrLongerForLetterType = (
    stringCharacterizerFiniteStateMachineCollection: StringCharacterizerFiniteStateMachineCollectionInterface,
    startIndex: number,
    exclusiveEndIndex: number,
    targetLetter: string,
    streakMinimum: number,
) => boolean;
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
    return md5(salt + index.toString());
}

export interface StringCharacterizerFiniteStateMachineCollectionInterface {
    getValueAtIndex(
        index: number,
    ): StringCharacterizerFiniteStateMachineInterface;
}
export class StringCharacterizerFiniteStateMachineCollectionA implements StringCharacterizerFiniteStateMachineCollectionInterface {
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
        let fsm: StringCharacterizerFiniteStateMachineInterface | undefined =
            this.stringCharacterizerFiniteStateMachines[index];
        if (undefined === fsm) {
            const hash = generateHash(this.salt, index);
            fsm =
                this.stringCharacterizerFiniteStateMachineFactory.fabricate(
                    hash,
                );
            if (MEMOIZE) {
                this.stringCharacterizerFiniteStateMachines[index] = fsm;
            }
        }
        return fsm;
    }
}

export const getFirstLetterWithStreakOrLonger = (
    stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
    streakMinimum: number = 3,
) => {
    let letter: string | null = null;
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
    return letter;
};

export const findFirstLetterWithStreakOrLonger: findFirstLetterWithStreakOrLongerType =
    (
        stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
        streakMinimum: number = 3,
    ) => {
        let letter: string | null = null;
        letter = getFirstLetterWithStreakOrLonger(
            stringCharacterizerFiniteStateMachine,
            streakMinimum,
        );
        while (
            letter === null &&
            !stringCharacterizerFiniteStateMachine.isDone()
        ) {
            stringCharacterizerFiniteStateMachine.advance();
            letter = getFirstLetterWithStreakOrLonger(
                stringCharacterizerFiniteStateMachine,
                streakMinimum,
            );
        }
        return letter;
    };

export function hasStreakOrLongerForLetter(
    stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
    targetLetter: string,
    streakMinimum: number = 5,
) {
    let streak =
        stringCharacterizerFiniteStateMachine.getLongestStreakForLetter(
            targetLetter,
        );
    while (
        streak < streakMinimum &&
        !stringCharacterizerFiniteStateMachine.isDone()
    ) {
        stringCharacterizerFiniteStateMachine.advance();
        streak =
            stringCharacterizerFiniteStateMachine.getLongestStreakForLetter(
                targetLetter,
            );
    }
    return streak >= streakMinimum;
}

export const rangeContainsStreakOrLongerForLetter: rangeContainsStreakOrLongerForLetterType =
    (
        stringCharacterizerFiniteStateMachineCollection: StringCharacterizerFiniteStateMachineCollectionInterface,
        startIndex: number,
        exclusiveEndIndex: number,
        targetLetter: string,
        streakMinimum: number = 5,
    ) => {
        let exists: boolean = false;
        while (false == exists && startIndex < exclusiveEndIndex) {
            const dependentStringCharacterizerFiniteStateMachine =
                stringCharacterizerFiniteStateMachineCollection.getValueAtIndex(
                    startIndex,
                );
            const subject =
                dependentStringCharacterizerFiniteStateMachine.getSubject();
            exists = hasStreakOrLongerForLetter(
                dependentStringCharacterizerFiniteStateMachine,
                targetLetter,
                streakMinimum,
            );
            startIndex++;
        }
        return exists;
    };

export function* generateKey(
    stringCharacterizerFiniteStateMachineCollection: StringCharacterizerFiniteStateMachineCollectionInterface,
    findFirstLetterWithStreakOrLonger: findFirstLetterWithStreakOrLongerType,
    rangeContainsStreakOrLongerForLetter: rangeContainsStreakOrLongerForLetterType,
    startIndex: number = 0,
    targetStreakMinimum: number = 3,
    dependentStreakMinimum: number = 5,
    dependentsConsidered: number = 1000,
) {
    while (true) {
        let key: StringCharacterizerFiniteStateMachineInterface | null = null;
        while (null === key) {
            const targetStringCharacterizerFiniteStateMachine =
                stringCharacterizerFiniteStateMachineCollection.getValueAtIndex(
                    startIndex,
                );
            let targetLetter: string | null = findFirstLetterWithStreakOrLonger(
                targetStringCharacterizerFiniteStateMachine,
                targetStreakMinimum,
            );
            const subject =
                targetStringCharacterizerFiniteStateMachine.getSubject();
            if (targetLetter !== null) {
                let dependentFound: boolean = false;
                let dependentStringCharacterizerFiniteStateMachineIndex =
                    startIndex + 1;
                const dependentStringCharacterizerFiniteStateMachineIndexMaxBoundary =
                    dependentStringCharacterizerFiniteStateMachineIndex +
                    dependentsConsidered;
                dependentFound = rangeContainsStreakOrLongerForLetter(
                    stringCharacterizerFiniteStateMachineCollection,
                    dependentStringCharacterizerFiniteStateMachineIndex,
                    dependentStringCharacterizerFiniteStateMachineIndexMaxBoundary,
                    targetLetter,
                    dependentStreakMinimum,
                );
                if (true === dependentFound) {
                    key = targetStringCharacterizerFiniteStateMachine;
                }
            }
            startIndex++;
        }
        yield key.getSubject();
    }
}
