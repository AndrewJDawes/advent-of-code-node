import Mocha from "mocha";
import { expect } from "chai";
import StringArray from "./StringArray.js";

describe("StringArray", () => {
    describe("getIterator", () => {
        it("returns a Promise that resolves to an Iterator", async () => {
            const arr = ["cat", "dog", "mouse"];
            const stringArr = new StringArray(arr);
            const iterator = await stringArr.getIterator();
            // expect iterator to have a Symbol.asyncIterator property
            expect(iterator[Symbol.asyncIterator]).to.be.a("function");
        });
    });
});
