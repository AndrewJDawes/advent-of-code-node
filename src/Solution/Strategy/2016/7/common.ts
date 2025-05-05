export class AutonomousBridgeBypassAnnotationCounter {
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
    public supportsABBAProtocol() {
        return (
            this.getOutsideHypernetCount() > 0 &&
            this.getInsideHypernetCount() < 1
        );
    }
    public getOutsideHypernetCount() {
        return this.outsideHypernetCount;
    }
    public getInsideHypernetCount() {
        return this.insideHypernetCount;
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
