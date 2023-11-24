import * as assert from "assert";
import CourseController from "../../src/controllers/CourseController";
import { Err } from "../../src/lib";

describe("ExerciseController testing", function () {
    it("Retrieve course: Valid ID", async function () {
        const result = await CourseController.retrieveCourse(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.title, "Course 1");
        assert.equal(res.sessions.length, 1);
        assert.equal(res.sessions[0].title, "Session 1");
        assert.equal(res.sessions[0].session_id, 1);
    });
    it("Retrieve course: Valid ID", async function () {
        const result = await CourseController.retrieveCourse(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed getting sessions: Invalid course ID",
        );
    });

    it("Retrieve full course: Valid ID", async function () {
        const result = await CourseController.retrieveFullCourse(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.title, "Course 1");
        assert.equal(res.sessions.length, 1);
        assert.equal(res.sessions[0].title, "Session 1");
        assert.equal(res.sessions[0].session_id, 1);
        assert.equal(res.sessions[0].exercises.length, 1);
        assert.equal(res.sessions[0].exercises[0].title, "Exercise 1");
        assert.equal(res.sessions[0].exercises[0].exercise_id, 1);
    });
    it("Retrieve full course: Valid ID", async function () {
        const result = await CourseController.retrieveFullCourse(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed getting sessions: Invalid course ID",
        );
    });

    it("Update points: Valid", async function () {
        const result = await CourseController.updatePoints(1, 1, 1);
        assert.notEqual(result instanceof Err, true);
        assert.equal(result, 15);
    });
    it("Update points: Invalid exercise", async function () {
        const result = await CourseController.updatePoints(1, 1, 1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Invalid exercise ID");
    });
    it("Update points: Invalid enrollment", async function () {
        let result = await CourseController.updatePoints(1000, 1, 1);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
        result = await CourseController.updatePoints(1, 1000, 1);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
    });

    it("Decrement points: Valid", async function () {
        const result = await CourseController.decrementPoints(1, 1, 10);
        assert.notEqual(result instanceof Err, true);
        assert.equal(result, 5);
    });

    it("Decrement points: Invalid enrollment", async function () {
        let result = await CourseController.decrementPoints(1000, 1, 10);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
        result = await CourseController.decrementPoints(1, 1000, 10);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
    });
});
