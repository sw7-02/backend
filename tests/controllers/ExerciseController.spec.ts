import * as assert from "assert";
import ExerciseController from "../../src/controllers/ExerciseController";
import { Err } from "../../src/lib";
import prisma from "../../src/prisma";

describe("ExerciseController testing", function () {
    it("Retrieve all exercises: Valid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1);
        console.log(result);
        console.log(await prisma.session.findMany());
        assert.notEqual(result instanceof Err, true);
        assert.equal((<[]>result).length, 1);
    });
    it("Retrieve all exercises: Invalid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Session does not exist");
    });

    it("Retrieve specific exercise: Valid id", async function () {
        const result = await ExerciseController.retrieveExercise(1);
        console.log(result);
        console.log(await prisma.exercise.findMany());
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.exercise_id, 1);
        assert.equal(res.title, "Exercise 1");
        assert.equal(res.description, "Description of Exercise 1");
        assert.equal(res.points, 10);
        assert.equal(res.programming_language, "JavaScript");
        assert.equal(res.code_template, "Your code template here");
        //TODO: Hints, test_cases, and examples
    });
    it("Retrieve specific exercise: Invalid id", async function () {
        const result = await ExerciseController.retrieveExercise(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Exercise does not exist");
    });

    it("Submit exercise: New", async function () {
        const result = await ExerciseController.submitExerciseSolution(
            1,
            2,
            "solution from user2",
            false,
        );
        assert.notEqual(result instanceof Err, true);
    });
    it("Submit exercise: Invalid Exercise ID", async function () {
        const result = await ExerciseController.submitExerciseSolution(
            1000,
            1,
            "solution from user1",
            true,
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "User or Exercise does not exist");
    });
    it("Submit exercise: User ID", async function () {
        const result = await ExerciseController.submitExerciseSolution(
            1,
            1000,
            "solution from user1",
            true,
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "User or Exercise does not exist");
    });
    it("Submit exercise: Override", async function () {
        const result = await ExerciseController.submitExerciseSolution(
            1,
            1,
            "solution from user1",
            true,
        );
        assert.notEqual(result instanceof Err, true);
    });

    it("Retrieve submitted exercises: Valid ID", async function () {
        const result = await ExerciseController.retrieveAllExerciseSolutions(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any[]>result;
        assert.equal(res.length, 2);
        let temp = res[0];
        assert.equal(temp.solution, "solution from user1");
        assert.equal(temp.is_pinned, false);
        assert.equal(temp.username, "Anonymous");
        temp = res[1];
        assert.equal(temp.solution, "solution from user2");
        assert.equal(temp.is_pinned, false);
        assert.equal(temp.username, "user2");
    });
    it("Retrieve submitted exercises: Invalid ID", async function () {
        const result =
            await ExerciseController.retrieveAllExerciseSolutions(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Exercise does not exist");
    });

    it("Patch exercises: New hints", async function () {
        const pre = await prisma.exercise.findFirst({
            where: { exercise_id: 1 },
            include: { hints: true },
        });
        assert.equal(pre, true);
        assert.equal(pre!.hints.length, 1);
        assert.equal(pre!.hints[0].description, "Hint 1 description");
        assert.equal(pre!.hints[0].order, 1);

        const hints = ["Hint 1", "Hint 2", "Hint 3"];
        let result = await ExerciseController.patchExercise(1, { hints });
        assert.notEqual(result instanceof Err, true);

        const post = await prisma.exercise.findFirst({
            where: { exercise_id: 1 },
            include: { hints: true },
        });
        assert.equal(pre, true);
        assert.equal(pre!.hints.length, 3);
        for (let i = 0; i < 3; i++) {
            assert.equal(pre!.hints[i].description, hints[i]);
            assert.equal(pre!.hints[i].order, i + 1);
        }

        result = await ExerciseController.patchExercise(1, {
            hints: ["only one"],
        });
        assert.notEqual(result instanceof Err, true);

        const fix = await prisma.exercise.findFirst({
            where: { exercise_id: 1 },
            include: { hints: true },
        });
        assert.equal(fix, true);
        assert.equal(fix!.hints.length, 1);
        assert.equal(fix!.hints[0].description, "Hint 1 description");
        assert.equal(fix!.hints[0].order, 1);
    });

    // TODO: Add/Remove exercise (not in routes, ignored for now in testing)
    // TODO: Add/Remove hints/test cases
    // TODO: Testing code
});
