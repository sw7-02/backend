import * as assert from "assert";
import * as jwt from "jsonwebtoken";
import AuthController, {
    validatePassword,
} from "../../src/controllers/AuthController";
import config from "../../src/config";
import prisma from "../../src/prisma";
import { Err } from "../../src/lib";

describe("AuthController testing", function () {
    it("Signup New User", async function () {
        const res = await AuthController.signUp("user3", "password3@");
        assert.notEqual(res instanceof Err, true);
        const jwtPayload = <any>jwt.verify(<string>res, config.jwt.secret);
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
        const res = await AuthController.signUp("user1", "password1@");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 409);
        assert.equal(msg, "Username exists");
    });
    it("Signup invalid password", async function () {
        const res = await AuthController.signUp("user4", "password4");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            `Password not valid: Not enough special characters, there should be at least 1 special character`,
        );
    });

    it("Login Existing User", async function () {
        const res = await AuthController.login("user1", "password1@");
        assert.notEqual(res instanceof Err, true);
        const jwtPayload = <any>(
            jwt.verify((<any>res).jwt_token, config.jwt.secret)
        );
        assert.equal(jwtPayload.username, "user1");
        await prisma.user
            .findFirstOrThrow({
                where: {
                    username: "user1",
                },
            })
            .catch(() => assert.fail("unreachable"));
    });
    it("Login New User", async function () {
        const res = await AuthController.login("user4", "password4@");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 401);
        assert.equal(msg, "Username does not exist");
    });
    it("Login invalid password", async function () {
        const res = await AuthController.login("user1", "password1");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            `Password not valid: Not enough special characters, there should be at least 1 special character`,
        );
    });
    it("Login wrong password", async function () {
        const res = await AuthController.login("user1", "password2@");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 401);
        assert.equal(msg, `Wrong password`);
    });

    it("Password: Too short", async () => {
        const res = validatePassword("pass1&");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(msg, "Not long enough, should be at least 8 characters");
    });
    it("Password: Too few special characters", async () => {
        const res = validatePassword("password1");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            "Not enough special characters, there should be at least 1 special character",
        );
    });
    it("Password: Too few numbers", async () => {
        const res = validatePassword("password$");
        assert.equal(res instanceof Err, true);
        const { code, msg } = <Err>res;
        assert.equal(code, 406);
        assert.equal(
            msg,
            "Not enough numbers supplied, there should be at least 1 number",
        );
    });
    it("Correct Password", async () => {
        const res = validatePassword("password1@");
        assert.notEqual(res instanceof Err, true);
    });
});
