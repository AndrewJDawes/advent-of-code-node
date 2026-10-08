import { expect } from 'chai';
import {
    generateHash,
    StringCharacterizerFiniteStateMachineA,
} from './common.js';

describe('Solution 201614', () => {
    describe('Common', () => {
        describe('StringCharacterizerFiniteStateMachineA', () => {
            it('reports done only when advanced to bounds', () => {
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
            it('reports the longest streak for letters', () => {
                const subject = 'bbaaabbbcccaacccccaaabbbbbb';
                const sut = new StringCharacterizerFiniteStateMachineA(subject);
                while (!sut.isDone()) {
                    sut.advance();
                }
                expect(sut.getLongestStreakForLetter('a')).to.equal(3);
                expect(sut.getLongestStreakForLetter('b')).to.equal(6);
                expect(sut.getLongestStreakForLetter('c')).to.equal(5);
                expect(sut.getLongestStreakForLetter('d')).to.equal(0);
            });
            it('reports all letters with streak or longer', () => {
                const subject = 'bbaaabbbcccaacccccaaabbbbbb';
                const sut = new StringCharacterizerFiniteStateMachineA(subject);
                while (!sut.isDone()) {
                    sut.advance();
                }
                const letters = sut.getLettersWithStreakOrLonger(4);
                expect(letters.findIndex((val) => val === 'a')).to.equal(-1);
                expect(letters.findIndex((val) => val === 'b')).to.not.equal(
                    -1,
                );
                expect(letters.findIndex((val) => val === 'c')).to.not.equal(
                    -1,
                );
                expect(letters.findIndex((val) => val === 'd')).to.equal(-1);
            });
        });
        describe('generateHash', () => {
            it('yields consistent results given salt abc', () => {
                const salt = 'abc';
                const sut = generateHash(salt);
                expect(sut.next().value).to.equal(
                    '23734cd52ad4a4fb877d8a1e26e5df5f',
                );
                expect(sut.next().value).to.equal(
                    '63872b5565b2179bd72ea9c339192543',
                );
                expect(sut.next().value).to.equal(
                    '8a8b3aea9e3ca257a31cf91db6d6ba12',
                );
            });
        });
    });
});
