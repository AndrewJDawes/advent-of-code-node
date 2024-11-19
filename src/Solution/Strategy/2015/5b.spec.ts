import { expect } from 'chai';
import StringArray from '../../../InputFetcher/Service/StringArray.js';
import Solution20155b from './5b.js';

describe('Solution 20155b', () => {
    describe('solve', () => {
        it('interprets qjhvhtzxzqqjkmpb, xxyxx, uurcxstgmygtbstg, and ieodomkazucvgmuy as 2', async () => {
            const arr = [
                'qjhvhtzxzqqjkmpb',
                'xxyxx',
                'uurcxstgmygtbstg',
                'ieodomkazucvgmuy',
            ];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20155b(stringArr).solve();
            expect(solution).to.equal('2');
        });
    });
    describe('hasRepeatingLetterPair', () => {
        it('interprets xyxy as true', async () => {
            expect(Solution20155b.hasRepeatingLetterPair('xyxy')).to.be.true;
        });
        it('interprets aabcdefgaa as true', async () => {
            expect(Solution20155b.hasRepeatingLetterPair('aabcdefgaa')).to.be
                .true;
        });
        it('interprets aaa as false', async () => {
            expect(Solution20155b.hasRepeatingLetterPair('aaa')).to.be.false;
        });
    });
    describe('hasRepeatingSingleLetter', () => {
        it('iterprets xyx as true', async () => {
            expect(Solution20155b.hasRepeatingSingleLetter('xyx')).to.be.true;
        });
        it('iterprets abcdefeghi as true', async () => {
            expect(Solution20155b.hasRepeatingSingleLetter('abcdefeghi')).to.be
                .true;
        });
        it('iterprets aaa as true', async () => {
            expect(Solution20155b.hasRepeatingSingleLetter('aaa')).to.be.true;
        });
    });
});
