import * as assert from "assert";
import roleCheck from "../../src/middlewares/roleCheck";
import prisma from "../../src/prisma";
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import * as jwt from "jsonwebtoken";
import config from "../../src/config";
import { validateJWT } from "../../src/middlewares/validateJWT";

const nxtFunc = () => {};
let response: Response;
let request: Request;
let courseId = 1;

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

        response.locals.course_id = courseId;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to deny student access",
        );
        assert.equal(
            response.statusMessage,
            "You don't have the authorized role for this action",
            "Status message not accepted, roleChecker failed to deny student access",
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

        response.locals.course_id = courseId;

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

        response.locals.course_id = courseId;

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

        response.locals.course_id = courseId;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to deny teacher access",
        );
        assert.equal(
            response.statusMessage,
            "You don't have the authorized role for this action",
            "Status message not accepted, roleChecker failed to deny teacher access",
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

        response.locals.course_id = 2;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, roleChecker failed to deny TA access",
        );
        assert.equal(
            response.statusMessage,
            "You don't have the authorized role for this action",
            "Status message not accepted, roleChecker failed to deny TA access",
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

        response.locals.course_id = 2;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, roleChecker failed to grant TA access",
        );
    });

    it("Deny access: No enrollment", async function () {
        let roles = [0, 1, 2];
        let username = "user2";
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

        response.locals.course_id = 2;

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            404,
            "Status code not accepted, roleChecker failed to deny access: No enrollment found",
        );
        assert.equal(
            response.statusMessage,
            "Enrollment does not exist",
            "Status message not accepted, roleChecker failed to deny access: No enrollment found",
        );
    });
});
