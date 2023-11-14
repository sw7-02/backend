import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as assert from "assert";
import { validateJWT } from "../../src/middlewares/validateJWT";
import config from "../../src/config";
import httpMocks from "node-mocks-http";

const nxtFunc = () => {};
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const userId = 1;
const username = "test";
let response: Response;
let request: Request;

describe("Testing checkJWT", function () {
    beforeEach("Reset request and response", () => {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();
    });

    it("Accepts signed token", () => {
        // auth code
        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );

        validateJWT(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, checkJWT failed",
        );
        assert.equal(response.locals.jwtPayload.userId, userId);
        assert.equal(response.locals.jwtPayload.username, username);

        let auth: string = (
            response.getHeader(config.jwt.header) || "FAIL"
        ).toString();
        let jwtPayload = <any>jwt.verify(auth, config.jwt.secret);

        assert.equal(jwtPayload.userId, userId);
        assert.equal(jwtPayload.username, username);
    });

    it("Rejects non-signed token", () => {
        request.headers.auth = "fake token";
        response.send = (x) => x;
        validateJWT(request, response, nxtFunc);
        assert.equal(
            response.statusCode,
            401,
            "Status code not what checkJWT should return",
        );
        assert.equal(response.locals.jwtPayload, undefined);
    });

    it("New token works", () => {
        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );

        validateJWT(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, checkJWT failed",
        );
        assert.equal(response.locals.jwtPayload.userId, userId);
        assert.equal(response.locals.jwtPayload.username, username);
        let auth: string = (
            response.getHeader(config.jwt.header) || "FAIL"
        ).toString();
        let jwtPayload = <any>jwt.verify(auth, config.jwt.secret);
        assert.equal(jwtPayload.userId, userId);
        assert.equal(jwtPayload.username, username);

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        assert.equal(
            response.statusCode,
            200,
            "Status code not accepted, checkJWT failed",
        );
        assert.equal(response.locals.jwtPayload.userId, userId);
        assert.equal(response.locals.jwtPayload.username, username);
        auth = (response.getHeader(config.jwt.header) || "FAIL").toString();
        jwtPayload = <any>jwt.verify(auth, config.jwt.secret);
        assert.equal(jwtPayload.userId, userId);
        assert.equal(jwtPayload.username, username);
    });

    it("Deadline causes error token is invalid", async function () {
        this.timeout(5000);
        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: "1s",
            },
        );

        await delay(2000);
        validateJWT(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "Status code not what checkJWT should return",
        );
        assert.equal(response.locals.jwtPayload, undefined);
    });

    it("New token differs", async function () {
        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );

        validateJWT(request, response, nxtFunc);

        let auth: string = response.getHeader(config.jwt.header)!.toString();
        let jwtPayload = <any>jwt.verify(auth, config.jwt.secret);

        await delay(1000);

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );

        validateJWT(request, response, nxtFunc);

        let newAuth = response.getHeader(config.jwt.header)!.toString();
        let newJwtPayload = <any>jwt.verify(newAuth, config.jwt.secret);

        assert.notEqual(auth, newAuth);
        assert.equal(jwtPayload.username, newJwtPayload.username);
        assert.equal(jwtPayload.userId, newJwtPayload.userId);
    });

    it("Different users have different tokens", function () {
        let sig1 = jwt.sign({ userId, username }, config.jwt.secret, {
            expiresIn: config.jwt.deadline,
        });
        let sig2 = jwt.sign(
            { userId: userId + 1, username: "other user" },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        assert.notEqual(sig1, sig2);

        request.headers.auth = sig1;
        validateJWT(request, response, nxtFunc);
        let auth1: string = response
            .getHeader(config.jwt.header)!
            .toString();
        let jwtPayload1 = <any>jwt.verify(auth1, config.jwt.secret);
        request.headers.auth = sig2;
        validateJWT(request, response, nxtFunc);
        let auth2: string = response
            .getHeader(config.jwt.header)!
            .toString();
        let jwtPayload2 = <any>jwt.verify(auth2, config.jwt.secret);

        assert.notEqual(auth1, auth2);
        assert.notEqual(jwtPayload1.username, jwtPayload2.username);
        assert.notEqual(jwtPayload1.userId, jwtPayload2.userId);
    });
});
