import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import md5 from 'md5';
/*
--- Day 5: How About a Nice Game of Chess? ---
You are faced with a security door designed by Easter Bunny engineers that seem to have acquired most of their security knowledge by watching hacking movies.

The eight-character password for the door is generated one character at a time by finding the MD5 hash of some Door ID (your puzzle input) and an increasing integer index (starting with 0).

A hash indicates the next character in the password if its hexadecimal representation starts with five zeroes. If it does, the sixth character in the hash is the next character of the password.

For example, if the Door ID is abc:

The first index which produces a hash that starts with five zeroes is 3231929, which we find by hashing abc3231929; the sixth character of the hash, and thus the first character of the password, is 1.
5017308 produces the next interesting hash, which starts with 000008f82..., so the second character of the password is 8.
The third time a hash starts with five zeroes is for abc5278568, discovering the character f.
In this example, after continuing this search a total of eight times, the password is 18f47a30.

Given the actual Door ID, what is the password?
*/
// https://www.npmjs.com/package/js-md5?activeTab=code
class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const inputArray: string[] = [];
        const iterator = await this.inputFetcher.getAsyncIterator();
        for await (let line of iterator) {
            inputArray.push(line);
        }
        const input = inputArray.join('');
        let counter = 0;
        let passwordArray: (string | null)[] = Array(8).fill(null);
        const pattern = /^[0]{5}([0-7])(.).{25}$/;
        while (passwordArray.includes(null)) {
            const hashInput = `${input}${counter.toString()}`;
            const hash = md5(hashInput);
            const matches = hash.match(pattern);
            if (matches) {
                if (undefined !== matches[1] && undefined !== matches[2]) {
                    const position = parseInt(matches[1]);
                    const char = matches[2];
                    if (null === passwordArray[position]) {
                        passwordArray[position] = char;
                    }
                }
            }
            counter++;
        }
        return passwordArray.join('');
    }
}
export default Solution;
