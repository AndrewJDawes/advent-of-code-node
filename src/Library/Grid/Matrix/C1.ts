import { Matrix, Row } from '../Interfaces.js';

class MatrixC1 implements Matrix {
    rows: Row[];
    constructor(rows: Row[]) {
        this.rows = rows;
    }
    get(index: number): Row | undefined {
        return this.rows[index];
    }
    has(index: number): boolean {
        return undefined !== this.get(index);
    }
    height(): number {
        return this.rows.length;
    }
}
export default MatrixC1;
