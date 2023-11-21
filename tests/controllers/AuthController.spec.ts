import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import { validateJWT } from "../../src/middlewares/validateJWT";
import AuthController from "../../src/controllers/AuthController";
import config from "../../src/config";
import httpMocks from "node-mocks-http";
import { afterEach } from "mocha";
import prisma from "../../src/prisma";

describe("AuthController testing", function () {
    beforeEach("Reset request and response", () => {
        //seed();
    });

    afterEach("Remove all elements from DB", () => {
        prisma.user.deleteMany();
        prisma.course.deleteMany();
        prisma.session.deleteMany();
        prisma.enrollment.deleteMany();

        prisma.exercise.deleteMany();
        prisma.exerciseSolution.deleteMany();
        prisma.hint.deleteMany();
        prisma.testCase.deleteMany();

        prisma.assignment.deleteMany();
        prisma.assignmentSolution.deleteMany();
    })
})