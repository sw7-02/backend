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
        assert.notEqual(result instanceof Err, true);
        assert.equal((<[]>result).length, 1);
    });
    it("Retrieve all exercises: Invalid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 401);
        assert.equal((<Err>result).msg, "Session does not exist");
    });

    it("Retrieve specific exercises: Valid id", async function () {
        const result = await ExerciseController.retrieveExercise(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.exercise_id, 1);
        assert.equal(res.title, "Exercise 1");
        assert.equal(res.description, "Description of Exercise 1");
        assert.equal(res.points, 10);
        assert.equal(res.programming_language, "JavaScript");
        assert.equal(res.code_template, "Your code template here");
        //TODO: Hints and test_cases
    });
    it("Retrieve specific exercises: Invalid id", async function () {
        const result = await ExerciseController.retrieveExercise(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Exercise does not exist");
    });
});
