import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import AuthController from "../../src/controllers/AuthController";
import config from "../../src/config";
import { afterEach } from "mocha";
import prisma from "../../src/prisma";
import { exhaust, seed } from "../lib/db";
import { Error } from "../../src/lib";
import { validateAndHashPassword } from "../../src/controllers/AuthController";
import * as bcrypt from "bcryptjs";

describe("AuthController testing", function () {
    beforeEach("Insert data into DB", seed);

    afterEach("Remove all elements from DB", exhaust);

    it("Signup New User", async function () {
        let res = await AuthController.signUp("user3", "password3@");
        assert.equal(typeof res, "string");
        let jwtPayload = <any>jwt.verify(<string>res, config.jwt.secret);
        assert.equal(jwtPayload.username, "user3");
        try {
            await prisma.user
                .findFirstOrThrow({
                    where: {
                        username: "user3",
                    },
                })
                .catch(() => assert.notEqual(true, true));
        } catch (e) {
            assert.notEqual(true, true);
        }
    });
    it("Signup Existing User", async function () {
        let res = await AuthController.signUp("user1", "password1@");
        assert.equal(typeof jwt, typeof Error);
        const { code, msg } = <Error>res;
        assert.equal(code, 409);
        assert.equal(msg, "Username exists");
    });
    it("Signup invalid password", async function () {
        let res = await AuthController.signUp("user3", "password3");
        assert.equal(typeof jwt, typeof Error);
        const { code, msg } = <Error>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            `Password not valid: No special characters, there should be at least 1 special character`,
        );
    });

    it("Login Existing User", async function () {
        let res = await AuthController.login("user1", "password1@");
        assert.equal(typeof res, "string");
        let jwtPayload = <any>jwt.verify(<string>res, config.jwt.secret);
        assert.equal(jwtPayload.username, "user3");
        try {
            await prisma.user
                .findFirstOrThrow({
                    where: {
                        username: "user3",
                    },
                })
                .catch(() => assert.notEqual(true, true));
        } catch (e) {
            assert.notEqual(true, true);
        }
    });
    it("Login New User", async function () {
        let res = await AuthController.login("user3", "password3@");
        assert.equal(typeof jwt, typeof Error);
        const { code, msg } = <Error>res;
        assert.equal(code, 401);
        assert.equal(msg, "User does not exist");
    });
    it("Login invalid password", async function () {
        let res = await AuthController.login("user1", "password1");
        assert.equal(typeof jwt, typeof Error);
        const { code, msg } = <Error>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            `Password not valid: No special characters, there should be at least 1 special character`,
        );
    });

    it("Password: Too short", async () => {
        await validateAndHashPassword("pass1&").then(
            (_) => assert.notEqual(true, true),
            (e) => {
                assert.equal(
                    e,
                    "Not long enough, should be at least 8 characters",
                );
            },
        );
    });
    it("Password: Too few special characters", async () => {
        await validateAndHashPassword("password1").then(
            (_) => assert.notEqual(true, true),
            (e) => {
                assert.equal(
                    e,
                    "Not enough special character supplied, there should be at least 1 special character",
                );
            },
        );
    });
    it("Password: Too few numbers", async () => {
        await validateAndHashPassword("password$").then(
            (_) => assert.notEqual(true, true),
            (e) => {
                assert.equal(
                    e,
                    "No numbers supplied, there should be at least 1 number",
                );
            },
        );
    });
    it("Correct Password", async () => {
        await validateAndHashPassword("password$").then(
            (s) => assert.equal(config.auth.salt, bcrypt.getSalt(s)),
            (e) => {
                assert.equal(e, "no error should happen");
            },
        );
    });
});
