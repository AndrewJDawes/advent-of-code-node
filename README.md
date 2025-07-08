# advent-of-code-node

## Todo

-   Try using a btree for ALL persisted states (including the interned canonicalized states)
-   Use WeakMaps for non-deterministic memoization of states, so that we can avoid memory leaks and allow garbage collection to clean up unused states.
-   If we think Garbage Collection thrashing is still the issue when it starts to slow down and there are breaks in between the steps, then we may want to try using a custom memory pool or database for the states, so that we can reuse the memory and avoid GC thrashing.

### 201611a and 201611b

GitHub Copilot
Yes, there are several ways you could optimize the performance (both memory and speed) of this code, especially for the Advent of Code 2016 Day 11 problem, which is a classic state-space search with a huge number of possible states.

1. State Canonicalization & Symmetry Reduction
   Current: Your state key (see BTreeKeyBuilding) is likely based on the exact arrangement of items and elevator.
   Optimization: Many states are equivalent under permutation of element names. For example, swapping all "hydrogen" and "lithium" in the state does not change the problem. Canonicalize the state by mapping element types to indices and always sorting them, so symmetric states are treated as identical. This can drastically reduce the number of unique states.
2. Efficient State Representation
   Current: Each state is represented by objects and arrays, and the key is likely a stringified version of the state.
   Optimization: Use a compact, fixed-size integer or tuple representation for the state. For example, encode the floor of each item and the elevator as numbers in a tuple or bitfield. This makes hashing and comparison much faster and reduces memory usage.
3. Pruning Invalid States Early
   Current: You check for failure states after generating permutations.
   Optimization: When generating new states, immediately discard any that are invalid (e.g., microchip fried) before adding to the queue or visited set. This reduces the search space and memory usage.
4. Priority Queue (A or Best-First Search)\*
   Current: BFS with a FIFO queue.
   Optimization: Use a priority queue (min-heap) with a heuristic (e.g., number of items on upper floors, or sum of item distances to the top) to guide the search. This can find solutions much faster than plain BFS.
5. Avoid Deep Copying
   Current: Each new state is created by copying the entire building/floor/item structure.
   Optimization: Use immutable data structures or more efficient shallow copies, or reuse objects where possible. If using a compact tuple/integer state, copying is trivial.
6. Visited Set Optimization
   Current: You use a BTree for visited states.
   Optimization: If you use a compact tuple or integer for state, a plain JavaScript Set or Map will be much faster and more memory efficient than a BTree.
   Example: Compact State Representation
   Suppose you have N pairs (generator, microchip) and 4 floors. You can represent the state as:

Example: Compact State Representation
Suppose you have N pairs (generator, microchip) and 4 floors. You can represent the state as:

type State = {
elevator: number; // 0-3
items: number[]; // items[2*i] = floor of generator i, items[2*i+1] = floor of microchip i
};

You can then serialize this as a string or a tuple for fast hashing and comparison.

Example: Canonicalization
Sort the pairs so that states that are equivalent under element renaming are treated as the same:

function canonicalize(state: State): string {
// Pair up generator/microchip for each element, sort by their positions
const pairs = [];
for (let i = 0; i < state.items.length; i += 2) {
pairs.push([state.items[i], state.items[i+1]]);
}
pairs.sort();
return `${state.elevator}|${pairs.map(p => p.join(',')).join('|')}`;
}

Example: A\* Heuristic
A simple heuristic: sum of distances of all items to the top floor, divided by elevator capacity.

Summary Table
Optimization Memory Speed Difficulty
State canonicalization High High Medium
Compact state representation High High Medium
Early pruning Med High Easy
Priority queue (A\*) - High Medium
Avoid deep copying Med Med Medium
Fast visited set High Med Easy
If you want, I can show you a code example for any of these optimizations! Let me know which you'd like to see implemented or explained in more detail.

### Log

Remove log files from history.

## How to use

-   `npm run dev` to watch and rebuild
-   Create a class that implements `InterfaceSolutionStrategy` organized inside the `src/Solution/Strategy` directory.
    -   These are organized by year and day
-   Create a mocha test file adjacent to it, with the same name as the file you created, but with `.spec.ts` extension
    -   So if your file was named `34.ts`, name your spec file `34.spec.ts`
-   Write your unit tests
-   Run `npm run test` and use the `-f` filter to run only your test (by name)
    -   Example: `npm run test -- --args  -f '20165b'`
-   Add your Solution class to: `FromConfig` factory
-   Add the Problem Input data to a config file - such as: `data/config/andrew.json`
-   View your results:
    -   `cat data/config/andrew.json | node dist/index.js | jq`
