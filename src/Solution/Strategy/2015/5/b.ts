import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
/*
--- Day 5: Doesn't He Have Intern-Elves For This? ---
Santa needs help figuring out which strings in his text file are naughty or nice.

A nice string is one with all of the following properties:

It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
For example:

ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
jchzalrnumimnmhp is naughty because it has no double letter.
haegwjzuvuyypxyu is naughty because it contains the string xy.
dvszwmarrgswjxmb is naughty because it contains only one vowel.
How many strings are nice?

--- Part Two ---
Realizing the error of his ways, Santa has switched to a better model of determining whether a string is naughty or nice. None of the old rules apply, as they are all clearly ridiculous.

Now, a nice string is one with all of the following properties:

- It contains a pair of any two letters that appears at least twice in the string without overlapping,
like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
- It contains at least one letter which repeats with exactly one letter between them,
like xyx, abcdefeghi (efe), or even aaa.

For example:

qjhvhtzxzqqjkmpb is nice because is has a pair that appears twice (qj) and a letter that repeats with exactly one letter between them (zxz).
xxyxx is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
uurcxstgmygtbstg is naughty because it has a pair (tg) but no repeat with a single letter between them.
ieodomkazucvgmuy is naughty because it has a repeating letter with one between (odo), but no pair that appears twice.

How many strings are nice under these new rules?
*/
class Solution20155b implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        let countOfNiceStrings = 0;
        for await (let line of iterator) {
            if (
                Solution20155b.hasRepeatingLetterPair(line) &&
                Solution20155b.hasRepeatingSingleLetter(line)
            ) {
                countOfNiceStrings++;
            }
        }
        return Promise.resolve(countOfNiceStrings.toString());
    }

    static hasRepeatingLetterPair(string: string): boolean {
        for (let i = 0; i < string.length - 1; i++) {
            let letterPair = string.slice(i, i + 2);
            if (string.indexOf(letterPair, i + 2) >= 0) {
                return true;
            }
        }
        return false;
    }

    static hasRepeatingSingleLetter(string: string): boolean {
        const stringAsArray = string.split('');
        for (let i = 0; i < stringAsArray.length - 1; i++) {
            if (stringAsArray[i] === stringAsArray[i + 2]) {
                return true;
            }
        }
        return false;
    }
}

export default Solution20155b;
