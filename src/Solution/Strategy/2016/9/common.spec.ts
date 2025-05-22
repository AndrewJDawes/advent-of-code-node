import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import {
    DecompressionStateMachine,
    DecompressionStateMachineStateObject,
    handleGatherSubject,
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
            expect(output).to.equal('');
            expect(state).to.eql({
                decompressionState: 'OPENDELIMITER',
                readLength: null,
                readFactor: null,
                buffer: ['('],
            });
        });
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
    });
});
