import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as assert from "assert";
import config from "../../src/config";
import httpMocks from "node-mocks-http";
import enrollmentCheck from "../../src/middlewares/enrollmentCheck";

const nxtFunc = () => {};
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const userId = 1;
const username = "test";
let response: Response;
let request: Request;

describe("Testing enrollmentCheck", function () {
    beforeEach("Reset request and response", () => {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();
    });

    it("Correct enrollment", async () => {
        request.params.course_id = "1";
        response.locals = {
            jwtPayload: {
                userId: 1,
                username: "user1",
            },
        };

        await enrollmentCheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, enrollmentCheck failed",
        );
        assert.equal(response.locals.courseId, 1);
    });

    it("Not enrolled: Wrong User ID", async () => {
        request.params.course_id = "1";
        response.locals = {
            jwtPayload: {
                userId: 1000,
                username: "user1000",
            },
        };

        await enrollmentCheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, enrollmentCheck failed",
        );
    });
    it("Not enrolled: Wrong Course ID", async () => {
        request.params.course_id = "1000";
        response.locals = {
            jwtPayload: {
                userId: 1,
                username: "user1",
            },
        };

        await enrollmentCheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not accepted, enrollmentCheck failed",
        );
        assert.equal(response.locals.courseId, 1);
    });

    it("Invalid Course ID", async () => {
        request.params.course_id = "1000A";
        response.locals = {
            jwtPayload: {
                userId: 1,
                username: "user1",
            },
        };

        await enrollmentCheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            400,
            "Status code not accepted, enrollmentCheck failed",
        );
        assert.equal(response.locals.courseId, 1);
    });
});
