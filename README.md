# advent-of-code-node

## How to use

-   Create a class that implements `InterfaceSolutionStrategy` organized inside the `src/Solution/Strategy` directory.
    -   These are organized by year and day
-   Create a mocha test file adjacent to it, with the same name as the file you created, but with `.spec.ts` extension
    -   So if your file was named `34.ts`, name your spec file `34.spec.ts`
-   Write your unit tests
-   Run `mocha` and use the `-f` filter to run only your test (by name)
    -   Example: `node_modules/mocha/bin/mocha.js  -f 'Solution 20151'`

## TODO

-   [ ] Update this factory to check the date/day and use that to determine which concrete instance to instantiate: src/Solution/Factory/FromConfig.ts
-   [ ] Write a test script that will let us run (or run index.ts) in test mode to use test data (config.json?)
