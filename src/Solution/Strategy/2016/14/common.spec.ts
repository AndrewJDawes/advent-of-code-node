import { expect } from 'chai';
import { StringCharacterizerFiniteStateMachineA } from './common.js';

describe('Solution 201614', () => {
    describe('Common', () => {
        describe('StringCharacterizerFiniteStateMachineA', () => {
            it('reports done when advanced to bounds', () => {
                const bound = 5;
                const sut = new StringCharacterizerFiniteStateMachineA(
                    'a'.repeat(bound),
                );
                const boundMinusOne = bound - 1;
                for (let i = 0; i < boundMinusOne; i++) {
                    sut.advance();
                    expect(
                        sut.isDone(),
                        'sut should not be done until bounds reached',
                    ).to.be.false;
                }
                sut.advance();
                expect(sut.isDone(), 'sut should be done when bounds reached')
                    .to.be.true;
            });
        });
    });
});
