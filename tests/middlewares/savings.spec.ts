import * as assert from "assert";
import roleCheck from "../../src/middlewares/roleCheck";
import prisma from "../../src/prisma";
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import * as jwt from "jsonwebtoken";
import config from "../../src/config";
import validateJWT from "../../src/middlewares/validateJWT";
import {
    saveAssignmentId,
    saveExerciseId,
    saveSessionId,
} from "../../src/middlewares/savings";
import enrollmentCheck from "../../src/middlewares/enrollmentCheck";

const nxtFunc = () => {};
let response: Response;
let request: Request;
let courseId = 1;

describe("Savings testing", function () {
    beforeEach("Reset request and response", function () {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();
    });

    it("Save ExerciseId: Valid", function () {
        request.params.exercise_id = "1";

        saveExerciseId(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, saveExerciseId failed",
        );
        assert.equal(response.locals.exerciseId, 1);
    });
    it("Save ExerciseId: Invalid", function () {
        request.params.exercise_id = "1a";

        saveExerciseId(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            400,
            "Status code not accepted, saveExerciseId failed",
        );
        assert.equal(response.locals.exerciseId, undefined);
    });

    it("Save SessionId: Valid", function () {
        request.params.session_id = "1";

        saveSessionId(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, saveSessionId failed",
        );
        assert.equal(response.locals.sessionId, 1);
    });
    it("Save SessionId: Invalid", function () {
        request.params.session_id = "1b";

        saveSessionId(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            400,
            "Status code not accepted, saveSessionId failed",
        );
        assert.equal(response.locals.sessionId, undefined);
    });

    it("Save AssignmentId: Valid", function () {
        request.params.assignment_id = "1";

        saveAssignmentId(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, saveAssignmentId failed",
        );
        assert.equal(response.locals.assignmentId, 1);
    });
    it("Save AssignmentId: Invalid", function () {
        request.params.assignment_id = "1c";

        saveAssignmentId(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            400,
            "Status code not accepted, saveAssignmentId failed",
        );
        assert.equal(response.locals.assignmentId, undefined);
    });
});
