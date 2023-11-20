import * as assert from "assert";
import prisma from "../src/prisma";
// how to test - https://thiagooliveirasantos.medium.com/typescript-unit-tests-best-practices-part-4-clean-test-suites-structure-94f5fd5fdf8

describe("Testing framework test (and prisma)", () => {
    it("add two numbers", () => {
        assert.equal(2 + 2, 4);
    });
    it("add two numbers", () => {
        assert.notEqual(2 + 3, 4);
    });
    it("prisma empty", async () => {
        try {
            return await prisma.user
                .findFirstOrThrow({
                    where: { username: "test", user_password: "encrypt" },
                    select: { user_id: true, username: true },
                })
                .then(
                    ({ user_id: userId, username }) => console.log("what?"),
                    (_) => {},
                );
        } catch (e) {
            console.log("no errors");
            assert.equal(true, true);
        }
    });
    it("prisma has", async () => {
        const user1 = await prisma.user.create({
            data: {
                username: "tsetuser1",
                user_password: "password1",
            },
        });
        try {
            await prisma.user
                .findFirstOrThrow({
                    where: {
                        username: "testuser1",
                        user_password: "password1",
                    },
                    select: { user_id: true, username: true },
                })
                .then(
                    ({ user_id: userId, username }) => assert.equal(true, true),
                    (_) => {
                        assert.equal(1, 2);
                    },
                );
        } catch (e) {
            console.log("There should be an user");
            assert.equal(true, false);
        }
    });
});
