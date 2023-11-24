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
        assert.equal(
            res[0].res.due_date.toString(),
            new Date("2023-12-21").toString(),
        );
    });
    it("Retrieve all assignments: Invalid session", async function () {
        const result = await AssignmentController.retrieveAllAssignments(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course does not exist");
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
        assert.equal(
            res.due_date.toString(),
            new Date("2023-12-21").toString(),
        );
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
    it("Submit assignment: Invalid Assignment id", async function () {
        const result = await AssignmentController.submitAssignementSolution(
            1000,
            1,
            "solution from user1",
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "User or Assignment doesn't exist");
    });
    it("Submit assignment: Invalid User id", async function () {
        const result = await AssignmentController.submitAssignementSolution(
            1,
            1000,
            "solution from user1000",
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "User or Assignment doesn't exist");
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
        const result =
            await AssignmentController.retrieveAllAssignmentSolutions(1);
        assert.notEqual(result instanceof Err, true);
        console.log(result);
        const res = <any[]>result;
        assert.equal(res.length, 2);
        let temp = res[0];
        assert.equal(temp.assignment_solution_id, 1);
        assert.equal(temp.solution, "solution from user1");
        temp = res[1];
        assert.equal(temp.assignment_solution_id, 2);
        assert.equal(temp.solution, "solution from user2");
    });
    it("Retrieve submitted assignment: Invalid ID", async function () {
        const result =
            await AssignmentController.retrieveAllAssignmentSolutions(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Assignment does not exist");
    });

    it("Post feedback: Valid ID", async function () {
        const result = await AssignmentController.postAssignmentFeedback(
            1,
            "feedback for user1",
        );
        assert.notEqual(result instanceof Err, true);
    });
    it("Post feedback: Invalid ID", async function () {
        const result = await AssignmentController.postAssignmentFeedback(
            1000,
            "feedback for user1000",
        );
        console.log(result);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Assignment solution does not exist");
    });

    it("Retrieve feedback: Valid", async function () {
        const result = await AssignmentController.retrieveAssignmentFeedback(
            1,
            1,
        );
        assert.notEqual(result instanceof Err, true);
        assert.equal(result, "feedback for user1");
    });
    it("Retrieve feedback: No feedback", async function () {
        const result = await AssignmentController.retrieveAssignmentFeedback(
            1,
            2,
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 204);
        assert.equal((<Err>result).msg, "Feedback has not been provided yet");
    });
    it("Retrieve feedback: Invalid Assignment ID", async function () {
        const result = await AssignmentController.retrieveAssignmentFeedback(
            1000,
            1,
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Assignment solution does not exist");
    });
    it("Retrieve feedback: Invalid User ID", async function () {
        const result = await AssignmentController.retrieveAssignmentFeedback(
            1,
            1000,
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Assignment solution does not exist");
    });
});
