import * as assert from "assert";
import ExerciseController from "../../src/controllers/ExerciseController";
import { Err } from "../../src/lib";
import prisma from "../../src/prisma";

describe("ExerciseController testing", function () {
    it("Retrieve all exercises: Valid session", async function () {
        const result = await ExerciseController.retrieveAllExercises(1);
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
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.exercise_id, 1);
        assert.equal(res.title, "Exercise 1");
        assert.equal(res.description, "Description of Exercise 1");
        assert.equal(res.points, 10);
        assert.equal(res.programming_language, "JavaScript");
        assert.equal(res.code_template, "Your code template here");

        assert.equal(res.hints.length, 1);
        assert.equal(res.hints[0], "Hint 1 description");

        assert.equal(res.examples.length, 2);
        assert.equal(res.examples[0].input, "[1, 2, 3]");
        assert.equal(res.examples[0].output, "6");
        assert.equal(res.examples[1].input, "[3, 4, 7]");
        assert.equal(res.examples[1].output, "14");
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

    it("Patch exercise: General stuff", async function () {
        const pre = await prisma.exercise
            .findFirstOrThrow({
                where: { exercise_id: 1 },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(pre!.exercise_id, 1);
        assert.equal(pre!.session_id, 1);
        assert.equal(pre!.title, "Exercise 1");
        assert.equal(pre!.description, "Description of Exercise 1");
        assert.equal(pre!.points, 10);
        assert.equal(pre!.programming_language, "JavaScript");
        assert.equal(pre!.code_template, "Your code template here");

        let result = await ExerciseController.patchExercise(1, {
            title: "1",
            description: "Description 1",
            points: 1,
            programmingLanguage: " Java",
            codeTemplate: "template ",
        });
        assert.notEqual(result instanceof Err, true);

        const post = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
            })
            .catch(() => assert.fail("Exercise gone"));

        assert.equal(post!.exercise_id, 1);
        assert.equal(post!.session_id, 1);
        assert.equal(post!.title, "1");
        assert.equal(post!.description, "Description 1");
        assert.equal(post!.points, 1);
        assert.equal(post!.programming_language, "Java");
        assert.equal(post!.code_template, "template");

        result = await ExerciseController.patchExercise(1, {
            title: "Exercise 1",
            description: "Description of Exercise 1",
            points: 10,
            programmingLanguage: "JavaScript",
            codeTemplate: "Your code template here",
        });
        assert.notEqual(result instanceof Err, true);

        const fix = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
            })
            .catch(() => assert.fail("Exercise gone"));

        assert.equal(fix!.exercise_id, 1);
        assert.equal(fix!.session_id, 1);
        assert.equal(fix!.title, "Exercise 1");
        assert.equal(fix!.description, "Description of Exercise 1");
        assert.equal(fix!.points, 10);
        assert.equal(fix!.programming_language, "JavaScript");
        assert.equal(fix!.code_template, "Your code template here");
    });
    it("Patch exercise: New Hints", async function () {
        const pre = await prisma.exercise
            .findFirstOrThrow({
                where: { exercise_id: 1 },
                include: { hints: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(pre!.hints.length, 1);
        assert.equal(pre!.hints[0].description, "Hint 1 description");
        assert.equal(pre!.hints[0].order, 1);

        const hints = ["Hint 1", "Hint 2", "Hint 3"];
        let result = await ExerciseController.patchExercise(1, { hints });
        assert.notEqual(result instanceof Err, true);

        const post = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
                include: { hints: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(post!.hints.length, 3);
        for (let i = 0; i < 3; i++) {
            assert.equal(post!.hints[i].description, hints[i]);
            assert.equal(post!.hints[i].order, i + 1);
        }

        result = await ExerciseController.patchExercise(1, {
            hints: ["Hint 1 description"],
        });
        assert.notEqual(result instanceof Err, true);

        const fix = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
                include: { hints: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(fix!.hints.length, 1);
        assert.equal(fix!.hints[0].description, "Hint 1 description");
        assert.equal(fix!.hints[0].order, 1);
    });
    it("Patch exercise: New Examples", async function () {
        const pre = await prisma.exercise
            .findFirstOrThrow({
                where: { exercise_id: 1 },
                include: { examples: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(pre!.examples.length, 2);
        assert.equal(pre!.examples[0].input, "[1, 2, 3]");
        assert.equal(pre!.examples[0].output, "6");
        assert.equal(pre!.examples[1].input, "[3, 4, 7]");
        assert.equal(pre!.examples[1].output, "14");

        const examples = [
            { input: "1", output: "2" },
            { input: "2", output: "4" },
            { input: "3", output: "6" },
        ];
        let result = await ExerciseController.patchExercise(1, { examples });
        assert.notEqual(result instanceof Err, true);

        const post = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
                include: { examples: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(post!.examples.length, 3);
        for (let i = 0; i < 3; i++) {
            assert.equal(post!.examples[i].input, examples[i].input);
            assert.equal(post!.examples[i].output, examples[i].output);
        }

        result = await ExerciseController.patchExercise(1, {
            examples: [
                { input: "[1, 2, 3]", output: "6" },
                { input: "[3, 4, 7]", output: "14" },
            ],
        });
        assert.notEqual(result instanceof Err, true);

        const fix = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
                include: { examples: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(fix!.examples.length, 2);
        assert.equal(fix!.examples[0].input, "[1, 2, 3]");
        assert.equal(fix!.examples[0].output, "6");
        assert.equal(fix!.examples[1].input, "[3, 4, 7]");
        assert.equal(fix!.examples[1].output, "14");
    });
    it("Patch exercise: New Test Cases", async function () {
        const pre = await prisma.exercise
            .findFirstOrThrow({
                where: { exercise_id: 1 },
                include: { test_case: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(pre!.test_case.length, 1);
        assert.equal(pre!.test_case[0].code, "Test case 1 code");

        const testCases = ["Case 1", "Case 2", "Case 3"];
        let result = await ExerciseController.patchExercise(1, { testCases });
        assert.notEqual(result instanceof Err, true);

        const post = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
                include: { test_case: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(post!.test_case.length, 3);
        for (let i = 0; i < 3; i++)
            assert.equal(post!.test_case[i].code, testCases[i]);

        result = await ExerciseController.patchExercise(1, {
            testCases: ["Test case 1 code"],
        });
        assert.notEqual(result instanceof Err, true);

        const fix = await prisma.exercise
            .findFirst({
                where: { exercise_id: 1 },
                include: { test_case: true },
            })
            .catch(() => assert.fail("Exercise gone"));
        assert.equal(fix!.test_case.length, 1);
        assert.equal(fix!.test_case[0].code, "Test case 1 code");
    });

    it("Add exercise: Only title", async function () {
        const result = await ExerciseController.addExercise(1, {
            title: "Exercise 2",
        });
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).exercise_id, 2);
        const ex = await prisma.exercise
            .findUniqueOrThrow({
                where: {
                    exercise_id: (<any>result).exercise_id,
                },
                include: { hints: true, examples: true, test_case: true },
            })
            .catch(() => assert.fail("unreachable"));
        assert.equal(ex.title, "Exercise 2");
        assert.equal(ex.description, "Description");
        assert.equal(ex.points, 10);
        assert.equal(ex.code_template, "Code template");
        assert.equal(ex.programming_language, "Language");
        assert.equal(ex.hints.length, 0);
        assert.equal(ex.examples.length, 0);
        assert.equal(ex.test_case.length, 0);
    });
    it("Add exercise: With properties", async function () {
        const result = await ExerciseController.addExercise(1, {
            title: "Exercise 3",
            description: "Desc",
            points: 1,
            programmingLanguage: "C",
            codeTemplate: "something",
            hints: ["hint"],
            examples: [{ input: "2", output: "0" }],
            testCases: ["test"],
        });
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).exercise_id, 3);
        const ex = await prisma.exercise
            .findUniqueOrThrow({
                where: {
                    exercise_id: (<any>result).exercise_id,
                },
                include: { hints: true, examples: true, test_case: true },
            })
            .catch(() => assert.fail("unreachable"));
        assert.equal(ex.title, "Exercise 3");
        assert.equal(ex.description, "Desc");
        assert.equal(ex.points, 1);
        assert.equal(ex.code_template, "something");
        assert.equal(ex.programming_language, "C");
        assert.equal(ex.hints.length, 1);
        assert.equal(ex.hints[0].description, "hint");
        assert.equal(ex.hints[0].order, 1);
        assert.equal(ex.examples.length, 1);
        assert.equal(ex.examples[0].input, "2");
        assert.equal(ex.examples[0].output, "0");
        assert.equal(ex.test_case.length, 1);
        assert.equal(ex.test_case[0].code, "test");
    });
    it("Add exercise: Invalid Session ID", async function () {
        const result = await ExerciseController.addExercise(1000, {
            title: "Exercise 100",
        });
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Session does not exist");
    });

    it("Remove exercise: Valid Exercise ID", async function () {
        let id = 2;
        let result = await ExerciseController.deleteExercise(id);
        assert.notEqual(result instanceof Err, true);
        assert.equal(
            await prisma.exercise.findFirst({ where: { exercise_id: id } }),
            null,
        );
        assert.equal(
            (await prisma.hint.findMany({ where: { exercise_id: id } })).length,
            0,
        );
        assert.equal(
            (await prisma.example.findMany({ where: { exercise_id: id } }))
                .length,
            0,
        );
        assert.equal(
            (await prisma.testCase.findMany({ where: { exercise_id: id } }))
                .length,
            0,
        );
        id = 3;
        result = await ExerciseController.deleteExercise(id);
        assert.notEqual(result instanceof Err, true);
        assert.equal(
            await prisma.exercise.findFirst({ where: { exercise_id: id } }),
            null,
        );
        assert.equal(
            (await prisma.hint.findMany({ where: { exercise_id: id } })).length,
            0,
        );
        assert.equal(
            (await prisma.example.findMany({ where: { exercise_id: id } }))
                .length,
            0,
        );
        assert.equal(
            (await prisma.testCase.findMany({ where: { exercise_id: id } }))
                .length,
            0,
        );
    });
    it("Remove exercise: Invalid Exercise ID", async function () {
        const result = await ExerciseController.deleteExercise(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Exercise does not exist");
    });

    // TODO: Test runner
});
