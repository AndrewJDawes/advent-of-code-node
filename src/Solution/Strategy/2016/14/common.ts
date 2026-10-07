export interface StringCharacterizerFiniteStateMachine {
    isDone(): boolean;
    getLongestStreakForLetter(letter: string): number;
    getLettersWithStreakOrLonger(): string[];
    advance(): void;
}
export class StringCharacterizerFiniteStateMachineA implements StringCharacterizerFiniteStateMachineA {
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
