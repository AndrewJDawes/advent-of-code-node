export type DecompressionState =
    | 'PASSTHROUGH'
    | 'OPENDELIMITER'
    | 'READLENGTH'
    | 'OPENOPERATOR'
    | 'READFACTOR'
    | 'GATHERSUBJECT';
export interface DecompressionStateMachineStateObject {
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

export function handlePassthrough(props: {
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

export function handleOpenDelimiter(props: {
    decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
    inputCharacter: string;
}) {
    const { decompressionStateMachineStateObject, inputCharacter } = props;
    validateInputLength(inputCharacter);
    decompressionStateMachineStateObject.buffer.push(inputCharacter);
    if (/\d/.test(inputCharacter)) {
        decompressionStateMachineStateObject.decompressionState = 'READLENGTH';
        decompressionStateMachineStateObject.readLength =
            (decompressionStateMachineStateObject.readLength ?? 0 * 10) +
            parseInt(inputCharacter);
        return '';
    }
    decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
    return decompressionStateMachineStateObject.buffer.splice(0).join('');
}

export function handleReadLength(props: {
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

export function handleOpenOperator(props: {
    decompressionStateMachineStateObject: DecompressionStateMachineStateObject;
    inputCharacter: string;
}) {
    const { decompressionStateMachineStateObject, inputCharacter } = props;
    validateInputLength(inputCharacter);
    decompressionStateMachineStateObject.buffer.push(inputCharacter);
    if (/\d/.test(inputCharacter)) {
        decompressionStateMachineStateObject.decompressionState = 'READFACTOR';
        decompressionStateMachineStateObject.readFactor =
            (decompressionStateMachineStateObject.readFactor ?? 0 * 10) +
            parseInt(inputCharacter);
        return '';
    }
    decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
    return decompressionStateMachineStateObject.buffer.splice(0).join('');
}

export function handleReadFactor(props: {
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

export function handleGatherSubject(props: {
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
        decompressionStateMachineStateObject.decompressionState = 'PASSTHROUGH';
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

export class DecompressionStateMachine {
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
                return handlePassthrough({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'OPENDELIMITER': {
                return handleOpenDelimiter({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'READLENGTH': {
                return handleReadLength({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'READFACTOR': {
                return handleReadFactor({
                    decompressionStateMachineStateObject:
                        this.decompressionStateMachineStateObject,
                    inputCharacter,
                });
            }
            case 'GATHERSUBJECT': {
                return handleGatherSubject({
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
}
