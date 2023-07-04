import Mocha from "mocha";
import { expect } from "chai";
import StringArrayIterator from "./StringArrayIterator.js";

describe("StringArrayIterator", () => {
    it("returns each and every item in the given array", async () => {
        const arr = ["one", "two", "three"];
        let index = 0;
        for await (const item of new StringArrayIterator(arr)) {
            expect(item).to.equal(arr[index]);
            index++;
        }
    });
});
