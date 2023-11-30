import * as assert from "assert";
import CourseController from "../../src/controllers/CourseController";
import { Err, Role } from "../../src/lib";
import prisma from "../../src/prisma";

describe("CourseController testing", function () {
    it("Create course: Valid title", async function () {
        const result = await CourseController.createCourse("Course 3");
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).course_id, 3);
        await prisma.course
            .findUniqueOrThrow({ where: { course_id: 2 } })
            .catch(() => assert.fail("course not created"));
    });

    it("Rename course: Valid Id", async function () {
        const result = await CourseController.renameCourse(3, "New title");
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).course_id, 3);
        await prisma.course.findUniqueOrThrow({ where: { course_id: 3 } }).then(
            (r) => assert.equal(r.title, "New title"),
            () => assert.fail("unreachable"),
        );
    });
    it("Rename course: Whitespace", async function () {
        const result = await CourseController.renameCourse(
            3,
            "  Newer title  ",
        );
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).course_id, 3);
        await prisma.course.findUniqueOrThrow({ where: { course_id: 3 } }).then(
            (r) => assert.equal(r.title, "Newer title"),
            () => assert.fail("unreachable"),
        );
    });
    it("Rename course: Invalid Id", async function () {
        const result = await CourseController.renameCourse(1000, "New title");
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course not found");
    });

    it("Delete course: Valid ID", async function () {
        const result = await CourseController.deleteCourse(3);
        assert.notEqual(result instanceof Err, true);
        await prisma.course.findUniqueOrThrow({ where: { course_id: 3 } }).then(
            () => assert.fail("course still exist"),
            () => {},
        );
        assert.equal((await prisma.course.findMany()).length, 2);
    });
    it("Delete course: Invalid ID", async function () {
        const result = await CourseController.deleteCourse(1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 500);
        assert.equal((<Err>result).msg, "Failed deleting course");
    });

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
        assert.equal((<any>result).total_points, 15);
    });
    it("Update points: Invalid exercise", async function () {
        const result = await CourseController.updatePoints(1, 1, 1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Invalid exercise ID");
    });
    it("Update points: Invalid Course ID", async function () {
        const result = await CourseController.updatePoints(1000, 1, 1);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
    });
    it("Update points: Invalid User ID", async function () {
        const result = await CourseController.updatePoints(1, 1000, 1);
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
        assert.equal((<any>result).total_points, 5);
    });
    it("Decrement points: Invalid Course ID", async function () {
        const result = await CourseController.decrementPoints(1000, 1, 10);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
    });
    it("Decrement points: Invalid User ID", async function () {
        const result = await CourseController.decrementPoints(1, 1000, 10);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal(
            (<Err>result).msg,
            "Failed finding enrollment: User not enrolled, or bad ID provided",
        );
    });

    it("Retrieve leaderboard: Valid ID", async function () {
        const result = await CourseController.retrieveLeaderboard(1, 1);
        assert.notEqual(result instanceof Err, true);
        const res = <any[]>result;
        assert.equal(res.length, 2);
        let user = res[0];
        assert.equal(user.username, "user1");
        assert.equal(user.total_points, 5);
        user = res[1];
        assert.equal(user.username, "Anonymous");
        assert.equal(user.total_points, 2);
    });
    it("Retrieve leaderboard: Valid ID from anonymous", async function () {
        const result = await CourseController.retrieveLeaderboard(1, 2);
        assert.notEqual(result instanceof Err, true);
        const res = <any[]>result;
        assert.equal(res.length, 2);
        let user = res[0];
        assert.equal(user.username, "user1");
        assert.equal(user.total_points, 5);
        user = res[1];
        assert.equal(user.username, "Anonymous (you)");
        assert.equal(user.total_points, 2);
    });
    it("Retrieve leaderboard: Invalid ID", async function () {
        const result = await CourseController.retrieveLeaderboard(1000, 1);
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

    it("Get Anonymity: Valid ID", async function () {
        let result = await CourseController.getAnonymity(1, 1);
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).is_anonymous, false);
        result = await CourseController.getAnonymity(2, 1);
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).is_anonymous, true);
    });
    it("Get Anonymity: Invalid User ID", async function () {
        const result = await CourseController.getAnonymity(1000, 1);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course or User does not exist");
    });
    it("Get Anonymity: Invalid Course ID", async function () {
        const result = await CourseController.getAnonymity(1, 1000);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course or User does not exist");
    });

    it("Set Anonymity: Valid ID", async function () {
        await CourseController.setAnonymity(1, 1, true);
        let result = await CourseController.getAnonymity(1, 1);
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).is_anonymous, true);
        await CourseController.setAnonymity(1, 1, false);
        result = await CourseController.getAnonymity(1, 1);
        assert.notEqual(result instanceof Err, true);
        assert.equal((<any>result).is_anonymous, false);
    });
    it("Set Anonymity: Invalid User ID", async function () {
        const result = await CourseController.setAnonymity(1000, 1, true);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course or User does not exist");
    });
    it("Set Anonymity: Invalid Course ID", async function () {
        const result = await CourseController.setAnonymity(1, 1000, true);
        assert.equal(result instanceof Err, true);
        assert.equal((<Err>result).code, 404);
        assert.equal((<Err>result).msg, "Course or User does not exist");
    });
});
