import * as assert from "assert";
import ExerciseController from "../../src/controllers/ExerciseController";
import AssignmentController from "../../src/controllers/AssignmentController";
import { Err } from "../../src/lib";

describe("AssignmentController testing", function () {
    it("Retrieve all assignments: Valid session", async function () {
        const result = await AssignmentController.retrieveAllAssignments(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any[]>result;
        assert.equal(res.length, 1);
        assert.equal(res[0].assignment_id, 1);
        assert.equal(res[0].title, "Assignment 1");
        assert.equal(res[0].due_date, new Date("2023-12-21"));
    });
    it("Retrieve all assignments: Invalid session", async function () {
        const result = await AssignmentController.retrieveAllAssignments(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Session does not exist");
    });

    it("Retrieve specific assignment: Valid id", async function () {
        const result = await AssignmentController.retrieveAssignment(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.assignment_id, 1);
        assert.equal(res.title, "Assignment 1");
        assert.equal(res.description, "Description of Assignment 1");
        assert.equal(res.programming_language, "JavaScript");
        assert.equal(res.code_template, "Your code template here");
        assert.equal(res.due_date, new Date("2023-12-21"));
        //TODO: Hints and test_cases
    });
    it("Retrieve specific assignment: Invalid id", async function () {
        const result = await AssignmentController.retrieveAssignment(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Assignment does not exist");
    });

    it("Submit assignment: New", async function () {
        const result = await AssignmentController.submitAssignementSolution(
            1,
            2,
            "solution from user2",
        );
        assert.notEqual(result instanceof Err, true);
    });
    it("Submit assignment: Invalid id", async function () {
        let result = await AssignmentController.submitAssignementSolution(
            1000,
            1,
            "solution from user1",
        );
        assert.equal(result instanceof Err, true);
        result = await AssignmentController.submitAssignementSolution(
            1,
            1000,
            "solution from user1000",
        );
        assert.equal(result instanceof Err, true);
    });
    it("Submit assignment: Override", async function () {
        const result = await AssignmentController.submitAssignementSolution(
            1,
            1,
            "solution from user1",
        );
        assert.notEqual(result instanceof Err, true);
    });

    it("Retrieve submitted assignment: Valid ID", async function () {
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
    it("Retrieve submitted assignment: Invalid ID", async function () {
        const result =
            await ExerciseController.retrieveAllExerciseSolutions(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Exercise does not exist");
    });

    // TODO: Add/Remove exercise (not in routes, ignored for now in testing)
});
