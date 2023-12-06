import * as assert from "assert";
import roleCheck, { isTeacher } from "../../src/middlewares/roleCheck";
import prisma from "../../src/prisma";
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import * as jwt from "jsonwebtoken";
import config from "../../src/config";
import validateJWT from "../../src/middlewares/validateJWT";
import enrollmentCheck from "../../src/middlewares/enrollmentCheck";

const nxtFunc = () => {};
let response: Response;
let request: Request;

describe("RoleCheck testing", function () {
    beforeEach("Reset request and response", async function () {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();
    });

    it("Deny student access", async function () {
        let roles = [1, 2];
        let username = "user1";
        let { user_id: userId } = await prisma.user
            .findFirstOrThrow({
                where: {
                    username: username,
                },
            })
            .catch(() => assert.fail("Unreachable"));

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);

        response.locals.courseId = 1;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to deny student access",
        );
    });

    it("Grant student access", async function () {
        let roles = [0];
        let username = "user1";
        let { user_id: userId } = await prisma.user
            .findFirstOrThrow({
                where: {
                    username: username,
                },
            })
            .catch(() => assert.fail("Unreachable"));

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );

        validateJWT(request, response, nxtFunc);
        request.params.course_id = "1";
        await enrollmentCheck(request, response, nxtFunc);

        //response.locals.courseId = 1;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, roleChecker failed to grant student access",
        );
    });

    it("Grant teacher access", async function () {
        let roles = [1];
        let username = "teacher";
        let { user_id: userId } = await prisma.user
            .findFirstOrThrow({
                where: {
                    username: username,
                },
            })
            .catch(() => assert.fail("Unreachable"));

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);
        request.params.course_id = "1";
        await enrollmentCheck(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, roleChecker failed to grant teacher access",
        );
    });

    it("Deny teacher access", async function () {
        let roles = [0, 2];
        let username = "teacher";
        let { user_id: userId } = await prisma.user
            .findFirstOrThrow({
                where: {
                    username: username,
                },
            })
            .catch(() => assert.fail("Unreachable"));

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);
        request.params.course_id = "2";
        await enrollmentCheck(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to deny teacher access",
        );
    });

    it("Deny TA access", async function () {
        let roles = [0, 1];
        let username = "user1";
        let { user_id: userId } = await prisma.user
            .findFirstOrThrow({
                where: {
                    username: username,
                },
            })
            .catch(() => assert.fail("Unreachable"));

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);
        request.params.course_id = "2";
        await enrollmentCheck(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to deny TA access",
        );
    });

    it("Grant TA access", async function () {
        let roles = [2];
        let username = "user1";
        let { user_id: userId } = await prisma.user
            .findFirstOrThrow({
                where: {
                    username: username,
                },
            })
            .catch(() => assert.fail("Unreachable"));

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);
        request.params.course_id = "2";
        await enrollmentCheck(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, roleChecker failed to grant TA access",
        );
    });

    it("Is teacher works", async function () {
        response.locals.isTeacher = true;
        await isTeacher(request, response, nxtFunc);
        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, roleChecker failed to grant Teacher access",
        );
    });
    it("Is teacher fails", async function () {
        response.locals.isTeacher = false;
        await isTeacher(request, response, nxtFunc);
        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to restrict Teacher access",
        );
    });
});
