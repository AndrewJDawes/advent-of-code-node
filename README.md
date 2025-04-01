# advent-of-code-node

## How to use

-   `npm run dev` to watch and rebuild
-   Create a class that implements `InterfaceSolutionStrategy` organized inside the `src/Solution/Strategy` directory.
    -   These are organized by year and day
-   Create a mocha test file adjacent to it, with the same name as the file you created, but with `.spec.ts` extension
    -   So if your file was named `34.ts`, name your spec file `34.spec.ts`
-   Write your unit tests
-   Run `mocha` and use the `-f` filter to run only your test (by name)
    -   Example: `node_modules/mocha/bin/mocha.js  -f 'Solution 20151'`
-   Add your Solution class to: `FromConfig` factory
-   Add the Problem Input data to a config file - such as: `data/config/andrew.json`
-   View your results:
    -   `cat data/config/andrew.json | node dist/index.js | jq`
