import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import ExerciseController from "../../src/controllers/ExerciseController";
import config from "../../src/config";
import { after, afterEach, before } from "mocha";
import prisma from "../../src/prisma";
import { exhaust, seed } from "../lib/db";
import { Err } from "../../src/lib";

describe("AuthController testing", function () {
    before("Seed DB", async function () {
        this.timeout(5000);
        await seed();
    });
    after("Purge DB", async () => await exhaust());

    it("Retrieve all exercises: Valid session", async function() {
        const result = await ExerciseController.retrieveAllExercises(1);
        assert.notEqual(result instanceof Err, true);
        assert.equal(result.length, 1);
    });

});
