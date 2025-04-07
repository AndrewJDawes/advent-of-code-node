export default class ColumnToRowInputTransformer {
    private windowSize: number;
    private buffer: string[][];
    private interstitialBuffer: string[][];
    constructor(windowSize: number) {
        this.windowSize = windowSize;
        this.buffer = [];
        this.interstitialBuffer = [];
    }
    public write(input: string[]) {
        this.interstitialBuffer.push(input);
        if (this.interstitialBuffer.length === this.windowSize) {
            const transform: string[][] = [];
            for (const row of this.interstitialBuffer.splice(0)) {
                row.forEach((item, index) => {
                    if (undefined === transform[index]) {
                        transform[index] = [];
                    }
                    transform[index].push(item);
                });
            }
            transform.forEach((val) => {
                this.buffer.push(val);
            });
        }
    }
    public read(): string[][] {
        return this.buffer.slice(0);
    }
}
