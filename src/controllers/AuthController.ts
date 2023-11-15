import prisma from "../prisma";
import * as bcrypt from "bcryptjs";
import config from "../config";
import * as jwt from "jsonwebtoken";
import { err, Result } from "../lib";
import { generateJWTToken } from "../lib";

const specialCharRegEx = new RegExp("^[a-zA-Z\\s/!@#$%^&*()]+$");
const numberRegEx = new RegExp("^[0-9]+$");
async function validateAndHashPassword(pw: string): Promise<string> {
    let pass = bcrypt.hash(pw, config.auth.salt);
    if (pw.length < config.auth.pw.length)
        return Promise.reject("Not long enough");

    if (
        (pw.match(numberRegEx)?.length || Number.NEGATIVE_INFINITY) <=
        config.auth.pw.num_count
    )
        return Promise.reject("No numbers supplied");

    if (
        (pw.match(specialCharRegEx)?.length || Number.NEGATIVE_INFINITY) <=
        config.auth.pw.special_count
    )
        return Promise.reject("No special characters");

    return await pass;
}

export default class AuthController {
    static login = async (
        username: string,
        password: string,
    ): Promise<Result> => {
        /*let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }*/
        return await validateAndHashPassword(password).then(
            async (encrypt) => {
                try {
                    return await prisma.user
                        .findFirstOrThrow({
                            where: { username, user_password: encrypt },
                            select: { user_id: true, username: true },
                        })
                        .then(
                            ({ user_id, username }) =>
                                generateJWTToken({ user_id, username }),
                            (_) => err(500, "Internal error"),
                        );
                } catch (e) {
                    return err(301, "Username does not exist");
                }
            },
            (e) => err(301, `Password not valid: ${e}`),
        );
    };

    static signUp = async (
        username: string,
        password: string,
    ): Promise<Result> => {
        return await validateAndHashPassword(password).then(
            async (encrypt) => {
                try {
                    await prisma.user.findFirstOrThrow({
                        where: { username },
                    });
                    return err(409, "Username exists");
                } catch (e) {
                    // Add user
                    let { user_id } = await prisma.user.create({
                        data: {
                            username,
                            user_password: encrypt,
                        },
                    });
                    return generateJWTToken({ user_id, username });
                }
            },
            (e) => err(301, `Password not valid: ${e}`),
        );
    };
}
