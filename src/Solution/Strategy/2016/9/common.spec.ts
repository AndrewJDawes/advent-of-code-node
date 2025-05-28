import { expect } from 'chai';
import {
    DecompressionStateMachine,
    DecompressionStateMachineRecursive,
    DecompressionStateMachineStateObject,
    handleGatherSubject,
    handleGatherSubjectRecursive,
    handleOpenDelimiter,
    handleOpenOperator,
    handlePassthrough,
    handleReadFactor,
    handleReadLength,
} from './common.js';
describe('DecompressionStateMachine', () => {
    describe('handlePassthrough', () => {
        it('handles receiving a ( character while in PASSTHROUGH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            };
            const output = handlePassthrough({
                decompressionStateMachineStateObject: state,
                inputCharacter: '(',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            });
        });
    });
    describe('handleOpenDelimiter', () => {
        it('handles receiving a X character while in OPENDELIMITER', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            };
            const output = handleOpenDelimiter({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'X',
            });
            expect(output).to.equal('(X');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
        it('handles receiving a numeric character while in OPENDELIMITER', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            };
            const output = handleOpenDelimiter({
                decompressionStateMachineStateObject: state,
                inputCharacter: '1',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READLENGTH',
                readLength: 1,
                readFactor: null,
                buffer: ['(', '1'],
            });
        });
    });
    describe('handleReadLength', () => {
        it('handles receiving a d character while in READLENGTH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READLENGTH',
                readLength: 1,
                readFactor: null,
                buffer: ['(', '1'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'd',
            });
            expect(output).to.equal('(1d');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
        it('handles receiving a numeric character while in READLENGTH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READLENGTH',
                readLength: 1,
                readFactor: null,
                buffer: ['(', '1'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: '2',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READLENGTH',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2'],
            });
        });
        it('handles receiving a x character while in READLENGTH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READLENGTH',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'x',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'OPENOPERATOR',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2', 'x'],
            });
        });
        it('handles receiving a f character while in OPENOPERATOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENOPERATOR',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2', 'x'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'f',
            });
            expect(output).to.equal('(12xf');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
    });
    describe('handleOpenOperator', () => {
        it('handles receiving a numeric character while in OPENOPERATOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENOPERATOR',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2', 'x'],
            };
            const output = handleOpenOperator({
                decompressionStateMachineStateObject: state,
                inputCharacter: '1',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 1,
                buffer: ['(', '1', '2', 'x', '1'],
            });
        });
    });
    describe('handleReadFactor', () => {
        it('handles receiving a z character while in READFACTOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 1,
                buffer: ['(', '1', '2', 'x', '1'],
            };
            const output = handleReadFactor({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'z',
            });
            expect(output).to.equal('(12x1z');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
        it('handles receiving a numeric character while in READFACTOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 1,
                buffer: ['(', '1', '2', 'x', '1'],
            };
            const output = handleReadFactor({
                decompressionStateMachineStateObject: state,
                inputCharacter: '3',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 13,
                buffer: ['(', '1', '2', 'x', '1', '3'],
            });
        });
        it('handles receiving a ) character while in READFACTOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'PASSTHROUGH',
                readLength: 12,
                readFactor: 13,
                buffer: ['(', '1', '2', 'x', '1', '3'],
            };
            const output = handleReadFactor({
                decompressionStateMachineStateObject: state,
                inputCharacter: ')',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'GATHERSUBJECT',
                readLength: 12,
                readFactor: 13,
                buffer: [],
            });
        });
    });
    describe('handleGatherSubject', () => {
        it('handles receiving a ( character while in GATHERSUBJECT', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'GATHERSUBJECT',
                readLength: 2,
                readFactor: 3,
                buffer: [],
            };
            const output = handleGatherSubject({
                decompressionStateMachineStateObject: state,
                inputCharacter: '(',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'GATHERSUBJECT',
                readLength: 2,
                readFactor: 3,
                buffer: ['('],
            });
        });
        it('handles receiving a x character while in GATHERSUBJECT', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'GATHERSUBJECT',
                readLength: 2,
                readFactor: 3,
                buffer: ['('],
            };
            const output = handleGatherSubject({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'x',
            });
            expect(output).to.equal('(x(x(x');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
    });
    describe('input', () => {
        it('interprets ADVENT as ADVENT', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = 'ADVENT';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('ADVENT');
        });
        it('interprets A(1x5)BC as ABBBBBC', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = 'A(1x5)BC';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('ABBBBBC');
        });
        it('interprets (3x3)XYZ as XYZXYZXYZ', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = '(3x3)XYZ';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('XYZXYZXYZ');
        });
        it('interprets A(2x2)BCD(2x2)EFG as ABCBCDEFEFG', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = 'A(2x2)BCD(2x2)EFG';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('ABCBCDEFEFG');
        });
        it('interprets (6x1)(1x3)A as (1x3)A', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = '(6x1)(1x3)A';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('(1x3)A');
        });
        it('interprets X(8x2)(3x3)ABCY as X(3x3)ABC(3x3)ABCY', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = 'X(8x2)(3x3)ABCY';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('X(3x3)ABC(3x3)ABCY');
        });
    });
});
describe('DecompressionStateMachineRecursive', () => {
    describe('handlePassthrough', () => {
        it('handles receiving a ( character while in PASSTHROUGH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            };
            const output = handlePassthrough({
                decompressionStateMachineStateObject: state,
                inputCharacter: '(',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            });
        });
    });
    describe('handleOpenDelimiter', () => {
        it('handles receiving a X character while in OPENDELIMITER', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            };
            const output = handleOpenDelimiter({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'X',
            });
            expect(output).to.equal('(X');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
        it('handles receiving a numeric character while in OPENDELIMITER', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            };
            const output = handleOpenDelimiter({
                decompressionStateMachineStateObject: state,
                inputCharacter: '1',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READLENGTH',
                readLength: 1,
                readFactor: null,
                buffer: ['(', '1'],
            });
        });
    });
    describe('handleReadLength', () => {
        it('handles receiving a d character while in READLENGTH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READLENGTH',
                readLength: 1,
                readFactor: null,
                buffer: ['(', '1'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'd',
            });
            expect(output).to.equal('(1d');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
        it('handles receiving a numeric character while in READLENGTH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READLENGTH',
                readLength: 1,
                readFactor: null,
                buffer: ['(', '1'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: '2',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READLENGTH',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2'],
            });
        });
        it('handles receiving a x character while in READLENGTH', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READLENGTH',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'x',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'OPENOPERATOR',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2', 'x'],
            });
        });
        it('handles receiving a f character while in OPENOPERATOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENOPERATOR',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2', 'x'],
            };
            const output = handleReadLength({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'f',
            });
            expect(output).to.equal('(12xf');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
    });
    describe('handleOpenOperator', () => {
        it('handles receiving a numeric character while in OPENOPERATOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'OPENOPERATOR',
                readLength: 12,
                readFactor: null,
                buffer: ['(', '1', '2', 'x'],
            };
            const output = handleOpenOperator({
                decompressionStateMachineStateObject: state,
                inputCharacter: '1',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 1,
                buffer: ['(', '1', '2', 'x', '1'],
            });
        });
    });
    describe('handleReadFactor', () => {
        it('handles receiving a z character while in READFACTOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 1,
                buffer: ['(', '1', '2', 'x', '1'],
            };
            const output = handleReadFactor({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'z',
            });
            expect(output).to.equal('(12x1z');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
        it('handles receiving a numeric character while in READFACTOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 1,
                buffer: ['(', '1', '2', 'x', '1'],
            };
            const output = handleReadFactor({
                decompressionStateMachineStateObject: state,
                inputCharacter: '3',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'READFACTOR',
                readLength: 12,
                readFactor: 13,
                buffer: ['(', '1', '2', 'x', '1', '3'],
            });
        });
        it('handles receiving a ) character while in READFACTOR', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'PASSTHROUGH',
                readLength: 12,
                readFactor: 13,
                buffer: ['(', '1', '2', 'x', '1', '3'],
            };
            const output = handleReadFactor({
                decompressionStateMachineStateObject: state,
                inputCharacter: ')',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'GATHERSUBJECT',
                readLength: 12,
                readFactor: 13,
                buffer: [],
            });
        });
    });
    describe('handleGatherSubjectRecursive', () => {
        it('handles receiving a ( character while in GATHERSUBJECT', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'GATHERSUBJECT',
                readLength: 2,
                readFactor: 3,
                buffer: [],
            };
            const output = handleGatherSubjectRecursive({
                decompressionStateMachineStateObject: state,
                inputCharacter: '(',
            });
            expect(output).to.equal(null);
            expect(state).to.eql({
                decompressionState: 'GATHERSUBJECT',
                readLength: 2,
                readFactor: 3,
                buffer: ['('],
            });
        });
        it('handles receiving a x character while in GATHERSUBJECT', async () => {
            const state: DecompressionStateMachineStateObject = {
                decompressionState: 'GATHERSUBJECT',
                readLength: 2,
                readFactor: 3,
                buffer: ['('],
            };
            const output = handleGatherSubjectRecursive({
                decompressionStateMachineStateObject: state,
                inputCharacter: 'x',
            });
            expect(output).to.equal('(x(x(x');
            expect(state).to.eql({
                decompressionState: 'PASSTHROUGH',
                readLength: null,
                readFactor: null,
                buffer: [],
            });
        });
    });
    describe('input', () => {
        it('interprets ADVENT as ADVENT', () => {
            const decompressionStateMachine = new DecompressionStateMachine();
            const input = 'ADVENT';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('ADVENT');
        });
        it('interprets A(1x5)BC as ABBBBBC', () => {
            const decompressionStateMachine =
                new DecompressionStateMachineRecursive();
            const input = 'A(1x5)BC';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('ABBBBBC');
        });
        it('interprets (3x3)XYZ as XYZXYZXYZ', () => {
            const decompressionStateMachine =
                new DecompressionStateMachineRecursive();
            const input = '(3x3)XYZ';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('XYZXYZXYZ');
        });
        it('interprets A(2x2)BCD(2x2)EFG as ABCBCDEFEFG', () => {
            const decompressionStateMachine =
                new DecompressionStateMachineRecursive();
            const input = 'A(2x2)BCD(2x2)EFG';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('ABCBCDEFEFG');
        });
        it('interprets (6x1)(1x3)A as (1x3)A', () => {
            const decompressionStateMachine =
                new DecompressionStateMachineRecursive();
            const input = '(6x1)(1x3)A';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('(1x3)A');
        });
        it('interprets X(8x2)(3x3)ABCY as X(3x3)ABC(3x3)ABCY', () => {
            const decompressionStateMachine =
                new DecompressionStateMachineRecursive();
            const input = 'X(8x2)(3x3)ABCY';
            const aggregator = [];
            for (const char of input.split('')) {
                const output = decompressionStateMachine.input(char);
                if (null !== output) {
                    aggregator.push(output);
                }
            }
            expect(aggregator.join('')).to.equal('X(3x3)ABC(3x3)ABCY');
        });
    });
});
