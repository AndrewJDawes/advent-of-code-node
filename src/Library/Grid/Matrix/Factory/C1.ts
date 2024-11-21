// interface MatrixFactory

import { Matrix, MatrixFactory } from '../../Interfaces.js';
import JustifiedPaddedRowC1 from '../../Row/JustifiedPaddedRowC1.js';
import MatrixC1 from '../C1.js';

class FactoryC1 implements MatrixFactory {
    multiArray: string[][];
    constructor(multiArray: string[][]) {
        this.multiArray = multiArray;
    }
    build(): Matrix {
        const maxLengthRow = this.multiArray.reduce((prev, curr) => {
            return curr.length > prev.length ? curr : prev;
        });
        const rows: JustifiedPaddedRowC1[] = this.multiArray.map(
            (array) => new JustifiedPaddedRowC1(array, maxLengthRow.length)
        );
        return new MatrixC1(rows);
    }
}

export default FactoryC1;
