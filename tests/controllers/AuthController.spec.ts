import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import { validateJWT } from "../../src/middlewares/validateJWT";
import AuthController from "../../src/controllers/AuthController";
import config from "../../src/config";
import httpMocks from "node-mocks-http";
import { afterEach } from "mocha";
import prisma from "../../src/prisma";
import { exhaust, seed } from "../lib/db";
import { Error } from "../../src/lib";
//import {validateAndHashPassword} from "../../src/controllers/AuthController"

describe("AuthController testing", function () {
    beforeEach("Insert data into DB", async () => await seed());

    afterEach("Remove all elements from DB", async () => await exhaust());

    it("New User", async function () {
        let res = await AuthController.signUp("user3", "password3@");
        assert.equal(typeof res, "string");
        let jwtPayload = <any>jwt.verify(<string>res, config.jwt.secret);
        assert.equal(jwtPayload.username, "user3");
        try {
            await prisma.user.findFirstOrThrow({
                where: {
                    username: "user3",
                },
            }).catch(() => assert.notEqual(true, true));
        } catch (e) {
            assert.notEqual(true, true);
        }
    });
    it("Existing User", async function () {
        let res = await AuthController.signUp("user1", "password1@");
        assert.equal(typeof jwt, typeof Error);
        const { code, msg } = <Error>res;
        assert.equal(code, 409);
        assert.equal(msg, "Username exists");
    });
});
