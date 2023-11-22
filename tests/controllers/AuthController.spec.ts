import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import AuthController from "../../src/controllers/AuthController";
import config from "../../src/config";
import { after, afterEach, before } from "mocha";
import prisma from "../../src/prisma";
import { exhaust, seed } from "../lib/db";
import { Err } from "../../src/lib";
import { validateAndHashPassword } from "../../src/controllers/AuthController";
import * as bcrypt from "bcryptjs";

const specialCharRegEx = new RegExp(
    `[!@#$%^&*()]{${config.auth.pw.special_count}}`,
);
const numberRegEx = new RegExp(`([0-9].*){${config.auth.pw.num_count}}`);

describe("AuthController testing", function () {
    before("Seed DB", seed);
    after("Purge DB", exhaust);
    //beforeEach("Insert data into DB", seed);

    //afterEach("Remove all elements from DB", exhaust);

    it("Signup New User", async function () {
        let res = await AuthController.signUp("user3", "password3@");
        assert.notEqual(res instanceof Err, true);
        let jwtPayload = <any>jwt.verify(<string>res, config.jwt.secret);
        assert.equal(jwtPayload.username, "user3");
        try {
            await prisma.user
                .findFirstOrThrow({
                    where: {
                        username: "user3",
                    },
                })
                .catch(() => assert.equal(true, true));
        } catch (e) {
            assert.fail("unreachable");
        }
    });
    it("Signup Existing User", async function () {
        let res = await AuthController.signUp("user1", "password1@");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 409);
        assert.equal(msg, "Username exists");
    });
    it("Signup invalid password", async function () {
        let res = await AuthController.signUp("user4", "password4");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            `Password not valid: No special characters, there should be at least 1 special character`,
        );
    });

    it("Login Existing User", async function () {
        let res = await AuthController.login("user1", "password1@");
        assert.notEqual(res instanceof Err, true);
        let jwtPayload = <any>jwt.verify(<string>res, config.jwt.secret);
        assert.equal(jwtPayload.username, "user1");
        try {
            await prisma.user.findFirstOrThrow({
                where: {
                    username: "user3",
                },
            });
        } catch (e) {
            assert.fail("unreachable");
        }
    });
    it("Login New User", async function () {
        let res = await AuthController.login("user4", "password4@");
        assert.equal(typeof res, "object");
        const { code, msg } = <Err>res;
        assert.equal(code, 401);
        assert.equal(msg, "User does not exist");
    });
    it("Login invalid password", async function () {
        let res = await AuthController.login("user1", "password1");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            `Password not valid: No special characters, there should be at least 1 special character`,
        );
    });

    it("Password: Too short", async () => {
        await validateAndHashPassword("pass1&").then(
            (_) => assert.fail("unreachable"),
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
            (_) => assert.fail("unreachable"),
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
            (_) => assert.fail("unreachable"),
            (e) => {
                assert.equal(
                    e,
                    "Not enough numbers supplied, there should be at least 1 number",
                );
            },
        );
    });
    it("Correct Password", async () => {
        await validateAndHashPassword("password1$").then(
            (s) => assert.equal(config.auth.salt, bcrypt.getSalt(s)),
            (e) => {
                assert.equal(e, "no error should happen");
            },
        );
    });
});
