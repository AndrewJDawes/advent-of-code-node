import { expect } from 'chai';
import C1 from './C1.js';
describe('CounterFrequencyPositional C1', () => {
    it('adds and iterate elements', () => {
        const counter = new C1<string>();
        counter.add(0, 'a');
        counter.add(0, 'b');
        counter.add(0, 'c');
        counter.add(0, 'b');
        counter.add(1, 'd');
        counter.add(1, 'e');
        counter.add(1, 'd');
        counter.add(1, 'f');
        counter.add(2, 'g');
        counter.add(2, 'g');
        counter.add(2, 'g');
        counter.add(2, 'h');
        expect([...counter]).to.eql([
            new Map([
                ['a', 1],
                ['b', 2],
                ['c', 1],
            ]),
            new Map([
                ['d', 2],
                ['e', 1],
                ['f', 1],
            ]),
            new Map([
                ['g', 3],
                ['h', 1],
            ]),
        ]);
    });
});
