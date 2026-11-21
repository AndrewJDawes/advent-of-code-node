import { expect, use } from 'chai';
import sinon from 'sinon';

import sinonChai from 'sinon-chai';
use(sinonChai);
import {
    findFirstLetterWithStreakOrLonger,
    generateHash,
    hasStreakOrLongerForLetter,
    rangeContainsStreakOrLongerForLetter,
    StringCharacterizerFiniteStateMachineA,
    StringCharacterizerFiniteStateMachineFactoryA,
    StringCharacterizerFiniteStateMachineCollectionA,
    StringCharacterizerFiniteStateMachineCollectionInterface,
    StringCharacterizerFiniteStateMachineInterface,
    findFirstLetterWithStreakOrLongerType,
    rangeContainsStreakOrLongerForLetterType,
    generateKey,
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
                expect(generateHash(salt, 0)).to.equal(
                    '577571be4de9dcce85a041ba0410f29f',
                );
                expect(generateHash(salt, 1)).to.equal(
                    '23734cd52ad4a4fb877d8a1e26e5df5f',
                );
                expect(generateHash(salt, 2)).to.equal(
                    '63872b5565b2179bd72ea9c339192543',
                );
            });
            it('generates hash which contains cc38887a5 when given salt abc and index 18', () => {
                expect(generateHash('abc', 18)).to.contain('cc38887a5');
            });
        });
        describe('StringCharacterizerFiniteStateMachineCollectionA', () => {
            it('gets expected value at index', () => {
                const salt = 'abc';
                const sut =
                    new StringCharacterizerFiniteStateMachineCollectionA(
                        salt,
                        generateHash,
                        new StringCharacterizerFiniteStateMachineFactoryA(),
                    );
                expect(sut.getValueAtIndex(0).getSubject()).to.equal(
                    '577571be4de9dcce85a041ba0410f29f',
                );
                expect(sut.getValueAtIndex(1).getSubject()).to.equal(
                    '23734cd52ad4a4fb877d8a1e26e5df5f',
                );
                expect(sut.getValueAtIndex(2).getSubject()).to.equal(
                    '63872b5565b2179bd72ea9c339192543',
                );
            });
        });
        describe('hasStreakOrLongerForLetter', () => {
            it('answers true when longer streak present', () => {
                const subject = 'bbaaabbbcccaacccccaaabbbbbb';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(hasStreakOrLongerForLetter(fsm, 'b', 4)).to.be.true;
            });
            it('answers true when exact streak present', () => {
                const subject = 'bbaaabbbcccaacccccaaabbbbbb';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(hasStreakOrLongerForLetter(fsm, 'c', 4)).to.be.true;
            });
            it('answers false when only lesser streak present', () => {
                const subject = 'bbaaabbbcccaacccccaaabbbbbb';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(hasStreakOrLongerForLetter(fsm, 'c', 6)).to.be.false;
            });
            it('answers false when no streak present', () => {
                const subject = 'bbaaabbbcccaacccccaaabbbbbb';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(hasStreakOrLongerForLetter(fsm, 'e', 5)).to.be.false;
            });
        });
        describe('rangeContainsStreakOrLongerForLetter', () => {
            it('answers true when range contains exact streak', () => {
                const salt = 'abc';
                const hashGenerator = generateHash;
                const factory =
                    new StringCharacterizerFiniteStateMachineFactoryA();
                const manager =
                    new StringCharacterizerFiniteStateMachineCollectionA(
                        salt,
                        hashGenerator,
                        factory,
                    );
                expect(
                    rangeContainsStreakOrLongerForLetter(manager, 0, 4, '5', 2),
                ).to.be.true;
            });
            it('answers true when range contains longer streak', () => {
                const salt = 'abc';
                const hashGenerator = generateHash;
                const factory =
                    new StringCharacterizerFiniteStateMachineFactoryA();
                const manager =
                    new StringCharacterizerFiniteStateMachineCollectionA(
                        salt,
                        hashGenerator,
                        factory,
                    );
                expect(
                    rangeContainsStreakOrLongerForLetter(manager, 0, 4, '7', 1),
                ).to.be.true;
            });
            it('answers false when range only contains shorter streak', () => {
                const salt = 'abc';
                const hashGenerator = generateHash;
                const factory =
                    new StringCharacterizerFiniteStateMachineFactoryA();
                const manager =
                    new StringCharacterizerFiniteStateMachineCollectionA(
                        salt,
                        hashGenerator,
                        factory,
                    );
                expect(
                    rangeContainsStreakOrLongerForLetter(manager, 0, 4, '7', 3),
                ).to.be.false;
            });
            it('answers false when range only contains no streak', () => {
                const salt = 'abc';
                const hashGenerator = generateHash;
                const factory =
                    new StringCharacterizerFiniteStateMachineFactoryA();
                const manager =
                    new StringCharacterizerFiniteStateMachineCollectionA(
                        salt,
                        hashGenerator,
                        factory,
                    );
                expect(
                    rangeContainsStreakOrLongerForLetter(manager, 0, 4, 'k', 1),
                ).to.be.false;
            });
        });
        describe('findFirstLetterWithStreakOrLonger', () => {
            it('returns null if no letter with streak or longer', () => {
                const subject = 'asdfasdfasdfaaa';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(findFirstLetterWithStreakOrLonger(fsm, 4)).to.be.null;
            });
            it('returns letter if letter with exact streak', () => {
                const subject = 'asdfasdfasddddfaa';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(findFirstLetterWithStreakOrLonger(fsm, 4)).to.equal('d');
            });
            it('returns letter if longer streak', () => {
                const subject = 'asdfasdfasddddddddfaa';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(findFirstLetterWithStreakOrLonger(fsm, 4)).to.equal('d');
            });
            it('returns letter e if subject is 347dac6ee8eeea4652c7476d0f97bee5 and constraint is 3', () => {
                const subject = '347dac6ee8eeea4652c7476d0f97bee5';
                const fsm = new StringCharacterizerFiniteStateMachineA(subject);
                expect(findFirstLetterWithStreakOrLonger(fsm, 10)).to.equal(
                    null,
                );
                expect(findFirstLetterWithStreakOrLonger(fsm, 3)).to.equal('e');
            });
        });
        // describe('generateKey', () => {
        //     it('returns value when match found first time', () => {
        //         const subject = 'aaafdafd';
        //         class StringCharacterizerFiniteStateMachineMock implements StringCharacterizerFiniteStateMachineInterface {
        //             getLettersWithStreakOrLonger(streak: number): string[] {
        //                 return ['a'];
        //             }
        //             getLongestStreakForLetter(letter: string): number {
        //                 return 3;
        //             }
        //             getSubject(): string {
        //                 return subject;
        //             }
        //             isDone(): boolean {
        //                 return false;
        //             }
        //             advance(): void {}
        //         }
        //         class StringCharacterizerFiniteStateMachineCollectionMock implements StringCharacterizerFiniteStateMachineCollectionInterface {
        //             getValueAtIndex(
        //                 index: number,
        //             ): StringCharacterizerFiniteStateMachineInterface {
        //                 return new StringCharacterizerFiniteStateMachineMock();
        //             }
        //         }
        //         const collection: StringCharacterizerFiniteStateMachineCollectionInterface =
        //             new StringCharacterizerFiniteStateMachineCollectionMock();
        //         const findFirstLetterWithStreakOrLongerMock: findFirstLetterWithStreakOrLongerType =
        //             (
        //                 stringCharacterizerFiniteStateMachine: StringCharacterizerFiniteStateMachineInterface,
        //                 streakMinimum?: number,
        //             ) => 'a';
        //         const rangeContainsStreakOrLongerForLetterMock: rangeContainsStreakOrLongerForLetterType =
        //             (
        //                 stringCharacterizerFiniteStateMachineCollection: StringCharacterizerFiniteStateMachineCollectionInterface,
        //                 startIndex: number,
        //                 exclusiveEndIndex: number,
        //                 targetLetter: string,
        //                 streakMinimum: number,
        //             ) => {
        //                 return true;
        //             };
        //         const sut = generateKey(
        //             collection,
        //             findFirstLetterWithStreakOrLongerMock,
        //             rangeContainsStreakOrLongerForLetterMock,
        //             0,
        //             3,
        //             3,
        //             1000,
        //         );
        //         const result = sut.next();
        //         expect(result.value).to.equal(subject);
        //     });
        //     it('returns value when no streak or longer found on first try', () => {
        //         const subject = 'aaafdafd';
        //         class StringCharacterizerFiniteStateMachineMock implements StringCharacterizerFiniteStateMachineInterface {
        //             getLettersWithStreakOrLonger(streak: number): string[] {
        //                 return ['a'];
        //             }
        //             getLongestStreakForLetter(letter: string): number {
        //                 return 3;
        //             }
        //             getSubject(): string {
        //                 return subject;
        //             }
        //             isDone(): boolean {
        //                 return false;
        //             }
        //             advance(): void {}
        //         }
        //         class StringCharacterizerFiniteStateMachineCollectionMock implements StringCharacterizerFiniteStateMachineCollectionInterface {
        //             getValueAtIndex(
        //                 index: number,
        //             ): StringCharacterizerFiniteStateMachineInterface {
        //                 return new StringCharacterizerFiniteStateMachineMock();
        //             }
        //         }
        //         const collection: StringCharacterizerFiniteStateMachineCollectionInterface =
        //             new StringCharacterizerFiniteStateMachineCollectionMock();

        //         const findFirstLetterWithStreakOrLongerMock = sinon.stub();
        //         findFirstLetterWithStreakOrLongerMock
        //             .onFirstCall()
        //             .returns(null);
        //         findFirstLetterWithStreakOrLongerMock
        //             .onSecondCall()
        //             .returns('a');
        //         const rangeContainsStreakOrLongerForLetterMock: rangeContainsStreakOrLongerForLetterType =
        //             (
        //                 stringCharacterizerFiniteStateMachineCollection: StringCharacterizerFiniteStateMachineCollectionInterface,
        //                 startIndex: number,
        //                 exclusiveEndIndex: number,
        //                 targetLetter: string,
        //                 streakMinimum: number,
        //             ) => {
        //                 return true;
        //             };
        //         const sut = generateKey(
        //             collection,
        //             findFirstLetterWithStreakOrLongerMock,
        //             rangeContainsStreakOrLongerForLetterMock,
        //             0,
        //             3,
        //             3,
        //             1000,
        //         );
        //         const result = sut.next();
        //         expect(findFirstLetterWithStreakOrLongerMock).to.have.callCount(
        //             2,
        //         );
        //         expect(result.value).to.equal(subject);
        //     });
        //     it('returns value when no dependent found on first try', () => {
        //         const subject = 'aaafdafd';
        //         class StringCharacterizerFiniteStateMachineMock implements StringCharacterizerFiniteStateMachineInterface {
        //             getLettersWithStreakOrLonger(streak: number): string[] {
        //                 return ['a'];
        //             }
        //             getLongestStreakForLetter(letter: string): number {
        //                 return 3;
        //             }
        //             getSubject(): string {
        //                 return subject;
        //             }
        //             isDone(): boolean {
        //                 return false;
        //             }
        //             advance(): void {}
        //         }
        //         class StringCharacterizerFiniteStateMachineCollectionMock implements StringCharacterizerFiniteStateMachineCollectionInterface {
        //             getValueAtIndex(
        //                 index: number,
        //             ): StringCharacterizerFiniteStateMachineInterface {
        //                 return new StringCharacterizerFiniteStateMachineMock();
        //             }
        //         }
        //         const collection: StringCharacterizerFiniteStateMachineCollectionInterface =
        //             new StringCharacterizerFiniteStateMachineCollectionMock();

        //         const findFirstLetterWithStreakOrLongerMock = sinon.stub();
        //         findFirstLetterWithStreakOrLongerMock
        //             .onFirstCall()
        //             .returns(null);
        //         findFirstLetterWithStreakOrLongerMock
        //             .onSecondCall()
        //             .returns('a');
        //         findFirstLetterWithStreakOrLongerMock
        //             .onThirdCall()
        //             .returns('a');
        //         const rangeContainsStreakOrLongerForLetterMock = sinon.stub();
        //         rangeContainsStreakOrLongerForLetterMock
        //             .onFirstCall()
        //             .returns(false);
        //         rangeContainsStreakOrLongerForLetterMock
        //             .onSecondCall()
        //             .returns(true);

        //         const sut = generateKey(
        //             collection,
        //             findFirstLetterWithStreakOrLongerMock,
        //             rangeContainsStreakOrLongerForLetterMock,
        //             0,
        //             3,
        //             3,
        //             1000,
        //         );
        //         const result = sut.next();
        //         expect(
        //             rangeContainsStreakOrLongerForLetterMock,
        //         ).to.have.callCount(2);
        //         expect(findFirstLetterWithStreakOrLongerMock).to.have.callCount(
        //             3,
        //         );
        //         expect(result.value).to.equal(subject);
        //     });
        //     it('returns value on index 39 when salt is abc', () => {
        //         const collection: StringCharacterizerFiniteStateMachineCollectionInterface =
        //             new StringCharacterizerFiniteStateMachineCollectionA(
        //                 'abc',
        //                 generateHash,
        //                 new StringCharacterizerFiniteStateMachineFactoryA(),
        //             );
        //         const findFirstLetterWithStreakOrLongerSpy = sinon.spy(
        //             findFirstLetterWithStreakOrLonger,
        //         );
        //         const sut = generateKey(
        //             collection,
        //             findFirstLetterWithStreakOrLongerSpy,
        //             rangeContainsStreakOrLongerForLetter,
        //             0,
        //             3,
        //             5,
        //             1000,
        //         );
        //         const result = sut.next();
        //         expect(findFirstLetterWithStreakOrLongerSpy).to.have.callCount(
        //             39,
        //         );
        //     });
        // });
    });
});
