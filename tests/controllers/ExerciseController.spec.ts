import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import ExerciseController from "../../src/controllers/ExerciseController";
import config from "../../src/config";
import { after, afterEach, before } from "mocha";
import prisma from "../../src/prisma";
import { exhaust, seed } from "../lib/db";
import { Err } from "../../src/lib";

describe("ExerciseController testing", function () {

    it("Retrieve all exercises: Valid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1);
        console.log(result);
        assert.notEqual(result instanceof Err, true);
        assert.equal((<[]>result).length, 1);
    });
    it("Retrieve all exercises: Invalid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1000);
        console.log(result);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 401);
        assert.equal((<Err>result).msg, "Session does not exist");
    });
});
