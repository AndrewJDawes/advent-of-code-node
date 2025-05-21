import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
/*
--- Day 9: Explosives in Cyberspace ---
Wandering around a secure area, you come across a datalink port to a new part of the network. After briefly scanning it for interesting files, you find one file in particular that catches your attention. It's compressed with an experimental format, but fortunately, the documentation for the format is nearby.

The format compresses a sequence of characters. Whitespace is ignored. To indicate that some sequence should be repeated, a marker is added to the file, like (10x2). To decompress this marker, take the subsequent 10 characters and repeat them 2 times. Then, continue reading the file after the repeated data. The marker itself is not included in the decompressed output.

If parentheses or other characters appear within the data referenced by a marker, that's okay - treat it like normal data, not a marker, and then resume looking for markers after the decompressed section.

For example:

ADVENT contains no markers and decompresses to itself with no changes, resulting in a decompressed length of 6.
A(1x5)BC repeats only the B a total of 5 times, becoming ABBBBBC for a decompressed length of 7.
(3x3)XYZ becomes XYZXYZXYZ for a decompressed length of 9.
A(2x2)BCD(2x2)EFG doubles the BC and EF, becoming ABCBCDEFEFG for a decompressed length of 11.
(6x1)(1x3)A simply becomes (1x3)A - the (1x3) looks like a marker, but because it's within a data section of another marker, it is not treated any differently from the A that comes after it. It has a decompressed length of 6.
X(8x2)(3x3)ABCY becomes X(3x3)ABC(3x3)ABCY (for a decompressed length of 18), because the decompressed data from the (8x2) marker (the (3x3)ABC) is skipped and not processed further.
What is the decompressed length of the file (your puzzle input)? Don't count whitespace.
*/

class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        for await (let line of iterator) {
        }
        return '';
    }
}
export default Solution;

type DecompressionState =
    | 'PASSTHROUGH'
    | 'OPENDELIMITER'
    | 'READLENGTH'
    | 'OPENOPERATOR'
    | 'READFACTOR'
    | 'GATHERSUBJECT';
interface DecompressionStateMachineStateObject {
    decompressionState: DecompressionState;
    readLength: null | number;
    readFactor: null | number;
    buffer: string[];
}

function validateInputLength(inputCharacter: string) {
    if (inputCharacter.length !== 1) {
        throw new Error(`inputCharacter length must be 1: ${inputCharacter}`);
    }
}
class DecompressionStateMachine {
    private decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
    constructor() {
        this.decompressionStateMachineStateObject = {
            decompressionState: 'PASSTHROUGH',
            readLength: null,
            readFactor: null,
            buffer: [],
        };
    }
    public input(inputCharacter: string) {
        validateInputLength(inputCharacter);
        switch (this.decompressionStateMachineStateObject.decompressionState) {
            case 'PASSTHROUGH': {
                return this.handlePassthrough({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'OPENDELIMITER': {
                return this.handleOpenDelimiter({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'READLENGTH': {
                return this.handleReadLength({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'READFACTOR': {
                return this.handleReadFactor({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'GATHERSUBJECT': {
                return this.handleGatherSubject({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            default: {
                throw new Error(
                    `Unknown state: ${this.decompressionStateMachineStateObject.decompressionState}`
                );
            }
        }
    }
    public handlePassthrough(props: {
        decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
        inputCharacter: string;
    }) {
        const { decompressionStateMachineStateObject, inputCharacter } = props;
        validateInputLength(inputCharacter);
        if ('(' === inputCharacter) {
            decompressionStateMachineStateObject.decompressionState =
                'OPENDELIMITER';
            decompressionStateMachineStateObject.buffer.push(inputCharacter);
            return '';
        }
        return inputCharacter;
    }
    public handleOpenDelimiter(props: {
        decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
        inputCharacter: string;
    }) {
        const { decompressionStateMachineStateObject, inputCharacter } = props;
        validateInputLength(inputCharacter);
        decompressionStateMachineStateObject.buffer.push(inputCharacter);
        if (/\d/.test(inputCharacter)) {
            decompressionStateMachineStateObject.decompressionState =
                'READLENGTH';
            decompressionStateMachineStateObject.readLength =
                (decompressionStateMachineStateObject.readLength ?? 0 * 10) +
                parseInt(inputCharacter);
            return '';
        }
        decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
        return decompressionStateMachineStateObject.buffer.splice(0).join('');
    }
    public handleReadLength(props: {
        decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
        inputCharacter: string;
    }) {
        const { decompressionStateMachineStateObject, inputCharacter } = props;
        validateInputLength(inputCharacter);
        decompressionStateMachineStateObject.buffer.push(inputCharacter);
        if (/\d/.test(inputCharacter)) {
            decompressionStateMachineStateObject.readLength =
                (decompressionStateMachineStateObject.readLength ?? 0 * 10) +
                parseInt(inputCharacter);
            return '';
        }
        if ('x' === inputCharacter) {
            decompressionStateMachineStateObject.decompressionState =
                'OPENOPERATOR';
            return '';
        }
        decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
        return decompressionStateMachineStateObject.buffer.splice(0).join('');
    }
    public handleOpenOperator(props: {
        decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
        inputCharacter: string;
    }) {
        const { decompressionStateMachineStateObject, inputCharacter } = props;
        validateInputLength(inputCharacter);
        decompressionStateMachineStateObject.buffer.push(inputCharacter);
        if (/\d/.test(inputCharacter)) {
            decompressionStateMachineStateObject.decompressionState =
                'READFACTOR';
            decompressionStateMachineStateObject.readFactor =
                (decompressionStateMachineStateObject.readFactor ?? 0 * 10) +
                parseInt(inputCharacter);
            return '';
        }
        decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
        return decompressionStateMachineStateObject.buffer.splice(0).join('');
    }
    public handleReadFactor(props: {
        decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
        inputCharacter: string;
    }) {
        const { decompressionStateMachineStateObject, inputCharacter } = props;
        validateInputLength(inputCharacter);
        decompressionStateMachineStateObject.buffer.push(inputCharacter);
        if (/\d/.test(inputCharacter)) {
            decompressionStateMachineStateObject.readFactor =
                (decompressionStateMachineStateObject.readFactor ?? 0 * 10) +
                parseInt(inputCharacter);
            return '';
        }
        if (')' === inputCharacter) {
            decompressionStateMachineStateObject.decompressionState =
                'GATHERSUBJECT';
            // empty the buffer
            decompressionStateMachineStateObject.buffer.splice(0);
            return '';
        }
        decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
        return decompressionStateMachineStateObject.buffer.splice(0).join('');
    }
    public handleGatherSubject(props: {
        decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
        inputCharacter: string;
    }) {
        const { decompressionStateMachineStateObject, inputCharacter } = props;
        validateInputLength(inputCharacter);
        decompressionStateMachineStateObject.buffer.push(inputCharacter);
        if (
            decompressionStateMachineStateObject.buffer.length ===
            (decompressionStateMachineStateObject.readLength ?? 0)
        ) {
            decompressionStateMachineStateObject.decompressionState =
                'PASSTHROUGH';
            let toRepeat = decompressionStateMachineStateObject.buffer
                .splice(0)
                .join('');
            for (
                let i = 0;
                i < (decompressionStateMachineStateObject.readFactor ?? 0);
                i++
            ) {
                toRepeat = toRepeat + toRepeat;
            }
            return toRepeat;
        }
        return '';
    }
}
