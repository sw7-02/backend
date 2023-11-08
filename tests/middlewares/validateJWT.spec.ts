import { Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as assert from "assert";
import { validateJWT } from "../../src/middlewares/validateJWT";
import config from "../../src/config";
import httpMocks from "node-mocks-http";

const nxtFunc = () => {};
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const userId = 1
const username = "test"
let response: Response;
let request: Request;

describe("Testing checkJWT", () => {

    beforeEach("Reset request and response", () => {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse()
    })

    it("Accepts signed token", () => {
        // auth code
        request.headers.auth = jwt.sign({ userId, username }, config.jwt.jwtSecret, {
            expiresIn: config.jwt.jwtDeadline,
        });

        validateJWT(request, response, nxtFunc);

        assert.equal(response.statusCode, 200, "Status code not accepted, checkJWT failed");
        assert.equal(response.locals.jwtPayload.userId, userId);
        assert.equal(response.locals.jwtPayload.username, username);

        let auth: string = (response.getHeader("auth-token") || "FAIL").toString()
        let jwtPayload = <any>jwt.verify(auth, config.jwt.jwtSecret);

        assert.equal(jwtPayload.userId, userId);
        assert.equal(jwtPayload.username, username);
    });

    it("Rejects non-signed token", () => {
        request.headers.auth = "fake token";
        response.send = (x) => x;
        validateJWT(request, response, nxtFunc);
        assert.equal(response.statusCode, 401, "Status code not what checkJWT should return");
        assert.equal(response.locals.jwtPayload, undefined);
    });

    it("New token works",  () => {
        request.headers.auth = jwt.sign({ userId, username }, config.jwt.jwtSecret, {
            expiresIn: config.jwt.jwtDeadline,
        });

        validateJWT(request, response, nxtFunc);

        assert.equal(response.statusCode, 200, "Status code not accepted, checkJWT failed");
        assert.equal(response.locals.jwtPayload.userId, userId);
        assert.equal(response.locals.jwtPayload.username, username);
        let auth: string = (response.getHeader("auth-token") || "FAIL").toString()
        let jwtPayload = <any>jwt.verify(auth, config.jwt.jwtSecret);
        assert.equal(jwtPayload.userId, userId);
        assert.equal(jwtPayload.username, username);

        request.headers.auth = jwt.sign({ userId, username }, config.jwt.jwtSecret, {
            expiresIn: config.jwt.jwtDeadline,
        });
        assert.equal(response.statusCode, 200, "Status code not accepted, checkJWT failed");
        assert.equal(response.locals.jwtPayload.userId, userId);
        assert.equal(response.locals.jwtPayload.username, username);
        auth = (response.getHeader("auth-token") || "FAIL").toString()
        jwtPayload = <any>jwt.verify(auth, config.jwt.jwtSecret);
        assert.equal(jwtPayload.userId, userId);
        assert.equal(jwtPayload.username, username);

    });

    it("Deadline causes error token is invalid", async () => {

        request.headers.auth = jwt.sign({ userId, username }, config.jwt.jwtSecret, {
            expiresIn: "1s",
        });

        await delay(2000);
        validateJWT(request, response, nxtFunc);

        assert.equal(response.statusCode, 401, "Status code not what checkJWT should return");
        assert.equal(response.locals.jwtPayload, undefined);
    });

});