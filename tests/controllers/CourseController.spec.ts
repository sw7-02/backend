import * as assert from "assert";
import CourseController from "../../src/controllers/CourseController";
import { Err, Role } from "../../src/lib";

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
    it("Retrieve course: Invalid ID", async function () {
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
    it("Retrieve full course: Invalid ID", async function () {
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

    it("Retrieve leaderboard: Valid ID", async function () {
        const result = await CourseController.retrieveLeaderboard(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any[]>result;
        assert.equal(res.length, 2);
        let user = res[0];
        assert.equal(user.username, "user1");
        assert.equal(user.total_points, 5);
        user = res[1];
        assert.equal(user.username, "user2");
        assert.equal(user.total_points, 2);
    });
    it("Retrieve leaderboard: Invalid ID", async function () {
        const result = await CourseController.retrieveLeaderboard(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course does not exist");
    });

    it("Retrieve enrolled courses: Valid ID", async function () {
        const result = await CourseController.retrieveEnrolledCourses(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any[]>result;
        assert.equal(res.length, 2);
        assert.equal(res[0].course_id, 1);
        assert.equal(res[0].title, "Course 1");
        assert.equal(res[0].user_role, Role.STUDENT);
        assert.equal(res[1].course_id, 2);
        assert.equal(res[1].title, "Course 2");
        assert.equal(res[1].user_role, Role.TA);
    });
    it("Retrieve enrolled courses: Invalid ID", async function () {
        const result = await CourseController.retrieveEnrolledCourses(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "User does not exist");
    });

    it("Retrieve session: Valid ID", async function () {
        const result = await CourseController.retrieveSessionFromCourse(1);
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res.session_id, 1);
        assert.equal(res.title, "Session 1");
        assert.equal(res.exercises.length, 1);
        assert.equal(res.exercises[0].exercise_id, 1);
        assert.equal(res.exercises[0].title, "Exercise 1");
    });
    it("Retrieve session: Invalid ID", async function () {
        const result = await CourseController.retrieveSessionFromCourse(1);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Session does not exist");
    });

    it("Insert session: Valid ID", async function () {
        const result = await CourseController.insertSessionFromCourse(
            1,
            "Session 2",
        );
        assert.notEqual(result instanceof Err, true);
        const res = <any>result;
        assert.equal(res, 2);
    });
    it("Insert session: Invalid ID", async function () {
        const result = await CourseController.insertSessionFromCourse(
            1000,
            "Session 1",
        );
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 400);
        assert.equal((<Err>result).msg, "Failed adding new session");
    });

    it("Delete session: Valid ID", async function () {
        const result = await CourseController.deleteSessionFromCourse(2);
        assert.notEqual(result instanceof Err, true);
    });
    it("Delete session: Invalid ID", async function () {
        const result = await CourseController.deleteSessionFromCourse(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 500);
        assert.equal((<Err>result).msg, "Failed deleting session");
    });
});
