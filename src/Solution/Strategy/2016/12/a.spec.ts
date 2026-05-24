import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution201612a, { execute } from './a.js';

describe('Solution201612a', () => {
    describe('execute', () => {
        it('leaves register a as 42 for the official example', () => {
            const result = execute([
                'cpy 41 a',
                'inc a',
                'inc a',
                'dec a',
                'jnz a 2',
                'dec a',
            ]);
            expect(result).to.equal(42);
        });

        it('increments and decrements registers', () => {
            const result = execute(['inc a', 'inc a', 'dec a', 'inc b']);
            expect(result).to.equal(1);
        });

        it('copies a literal into a register', () => {
            const result = execute(['cpy 5 a', 'cpy a b', 'inc b']);
            expect(result).to.equal(5);
        });

        it('throws when copying from a non-existent register', () => {
            expect(() => execute(['cpy b a'])).to.throw(
                'Register b does not exist',
            );
        });

        it('throws when jnz offset is not an integer', () => {
            expect(() => execute(['inc a', 'jnz a b'])).to.throw(
                'Jump offset must be an integer, got b',
            );
        });

        it('does not jump when the test value is zero', () => {
            const result = execute(['cpy 0 a', 'jnz a 2', 'inc a']);
            expect(result).to.equal(1);
        });

        it('jumps when the test value is not zero', () => {
            const result = execute(['cpy 1 a', 'jnz a 2', 'inc a']);
            expect(result).to.equal(1);
        });

        it('jumps to correct positive offset when the test value is not zero', () => {
            const result = execute(['cpy 1 a', 'jnz a 2', 'inc a', 'inc a']);
            expect(result).to.equal(2);
        });

        it('jumps to correct negative offset when the test value is not zero', () => {
            const result = execute(['cpy 1 a', 'dec a', 'jnz a -1']);
            expect(result).to.equal(0);
        });
    });

    describe('solve', () => {
        it('solves the official example via input fetcher', async () => {
            const input = new StringArray([
                'cpy 41 a',
                'inc a',
                'inc a',
                'dec a',
                'jnz a 2',
                'dec a',
            ]);
            const solution = await new Solution201612a(input).solve();
            expect(solution).to.equal('42');
        });
    });
});
