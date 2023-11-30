import * as assert from "assert";
import { Err } from "../../src/lib";
import SessionController from "../../src/controllers/SessionController";
import prisma from "../../src/prisma";

describe("SessionController testing", function () {
    it("Retrieve session: Valid ID", async function () {
        const result = await SessionController.retrieveSessionFromCourse(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.session_id, 1);
        assert.equal(res.title, "Session 1");
        assert.equal(res.exercises.length, 1);
        assert.equal(res.exercises[0].exercise_id, 1);
        assert.equal(res.exercises[0].title, "Exercise 1");
    });
    it("Retrieve session: Invalid ID", async function () {
        const result = await SessionController.retrieveSessionFromCourse(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Session does not exist");
    });

    it("Insert session: Valid ID", async function () {
        const result = await SessionController.insertSessionFromCourse(
            1,
            "Session 2",
        );
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.session_id, 2);
    });
    it("Insert session: Invalid ID", async function () {
        const result = await SessionController.insertSessionFromCourse(
            1000,
            "Session 1",
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 400);
        assert.equal((<Err>result).msg, "Failed adding new session");
    });

    it("Rename session: Valid id", async function () {
        const result = await SessionController.renameSessionFromCourse(
            2,
            "Session rename",
        );
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).session_id, 2);
        await prisma.session
            .findUniqueOrThrow({ where: { session_id: 2 } })
            .then(
                (r) => assert.equal(r.title, "Session rename"),
                () => assert.fail("unreachable"),
            );
    });
    it("Rename session: Whitespace", async function () {
        const result = await SessionController.renameSessionFromCourse(
            2,
            "  Session rename rename ",
        );
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).session_id, 2);
        await prisma.session
            .findUniqueOrThrow({ where: { session_id: 2 } })
            .then(
                (r) => assert.equal(r.title, "Session rename rename"),
                () => assert.fail("unreachable"),
            );
    });
    it("Rename session: Invalid Id", async function () {
        const result = await SessionController.renameSessionFromCourse(
            1000,
            "Session 1000",
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Session not found");
    });

    it("Delete session: Valid ID", async function () {
        const result = await SessionController.deleteSessionFromCourse(2);
        assert.notEqual(result instanceof Err, true);
    });
    it("Delete session: Invalid ID", async function () {
        const result = await SessionController.deleteSessionFromCourse(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 500);
        assert.equal((<Err>result).msg, "Failed deleting session");
    });
});
