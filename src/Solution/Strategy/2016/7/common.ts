export interface ProtocolValidator {
    add(character: string): void;
    isValid(): boolean;
}

export class ProtocolValidatorTLS implements ProtocolValidator {
    private outsideHypernetCount: number;
    private insideHypernetCount: number;
    private window: string[];
    private isHypernetSequence: boolean;
    constructor() {
        this.outsideHypernetCount = 0;
        this.insideHypernetCount = 0;
        this.window = [];
        this.isHypernetSequence = false;
    }
    public isValid() {
        return this.outsideHypernetCount > 0 && this.insideHypernetCount < 1;
    }
    public add(character: string) {
        if (!this.isHypernetSequence && character === '[') {
            this.isHypernetSequence = true;
            this.window.splice(0, this.window.length);
            return;
        }
        if (this.isHypernetSequence && character === ']') {
            this.isHypernetSequence = false;
            this.window.splice(0, this.window.length);
            return;
        }
        this.window.push(character);
        if (this.window.length >= 4) {
            if (
                this.window[0] === this.window[3] &&
                this.window[1] === this.window[2] &&
                this.window[0] !== this.window[1]
            ) {
                if (this.isHypernetSequence) {
                    this.insideHypernetCount++;
                } else {
                    this.outsideHypernetCount++;
                }
            }
            this.window.shift();
        }
    }
}

export class ProtocolValidatorSSL implements ProtocolValidator {
    private abaSequencesNormalized: Set<string>;
    private babSequencesNormalized: Set<string>;
    private intersectingNormalizedSequences: Set<string>;
    private window: string[];
    private isHypernetSequence: boolean;
    constructor() {
        this.abaSequencesNormalized = new Set();
        this.babSequencesNormalized = new Set();
        this.intersectingNormalizedSequences = new Set();
        this.window = [];
        this.isHypernetSequence = false;
    }
    public isValid(): boolean {
        return this.intersectingNormalizedSequences.size > 0;
    }
    public add(character: string) {
        if (!this.isHypernetSequence && character === '[') {
            this.isHypernetSequence = true;
            this.window.splice(0, this.window.length);
            return;
        }
        if (this.isHypernetSequence && character === ']') {
            this.isHypernetSequence = false;
            this.window.splice(0, this.window.length);
            return;
        }
        this.window.push(character);
        if (this.window.length >= 3) {
            const windowChars = [...this.window];
            this.window.shift();
            if (
                windowChars[0] === windowChars[2] &&
                windowChars[0] !== windowChars[1]
            ) {
                const normalizedSequence = this.isHypernetSequence
                    ? [windowChars[1], windowChars[0], windowChars[1]].join('')
                    : windowChars.join('');
                if (
                    this.intersectingNormalizedSequences.has(normalizedSequence)
                ) {
                    return;
                }
                if (this.isHypernetSequence) {
                    this.babSequencesNormalized.add(normalizedSequence);
                } else {
                    this.abaSequencesNormalized.add(normalizedSequence);
                }
                let newIntersections = new Set(
                    [...this.abaSequencesNormalized].filter((x) =>
                        this.babSequencesNormalized.has(x)
                    )
                );
                for (const intersectingSequence of newIntersections) {
                    this.intersectingNormalizedSequences.add(
                        intersectingSequence
                    );
                    this.abaSequencesNormalized.delete(intersectingSequence);
                    this.babSequencesNormalized.delete(intersectingSequence);
                }
            }
        }
    }
}
