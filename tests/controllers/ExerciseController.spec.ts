import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import ExerciseController from "../../src/controllers/ExerciseController";
import config from "../../src/config";
import { after, afterEach, before } from "mocha";
import prisma from "../../src/prisma";
import { exhaust, seed } from "../lib/db";
import { Err } from "../../src/lib";

describe("ExerciseController testing", function () {
    beforeEach("Seed DB", async function () {
        this.timeout(5000);
        await seed();
    });

    afterEach("Purge DB", async () => await exhaust());

    it("Retrieve all exercises: Valid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(0);
        assert.notEqual(result instanceof Err, true);
        assert.equal((<[]>result).length, 1);
    });
    it("Retrieve all exercises: Invalid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1000);
        assert.equal(result instanceof Err, true);
        assert.equal(result.code, 401);
        assert.equal(result.msg, "Session does not exist");
    });
});
