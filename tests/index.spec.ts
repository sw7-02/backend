import * as assert from "assert";
import prisma from "../src/prisma";
import { seed } from "./lib/db";
// how to test - https://thiagooliveirasantos.medium.com/typescript-unit-tests-best-practices-part-4-clean-test-suites-structure-94f5fd5fdf8

describe("Testing framework test (and prisma)", () => {
    it("add two numbers", () => {
        assert.equal(2 + 2, 4);
    });
    it("add two numbers", () => {
        assert.notEqual(2 + 3, 4);
    });
});

before("Seed DB", async function() {
    this.timeout(5000);
    await seed();
})