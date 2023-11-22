import prisma from "../prisma";
import * as bcrypt from "bcryptjs";
import config from "../config";
import { Err, Result } from "../lib";
import { generateJWTToken } from "../lib";

const specialCharRegEx = new RegExp(
    `[!@#$%^&*()]{${config.auth.pw.special_count}}`,
);
const numberRegEx = new RegExp(`([0-9].*){${config.auth.pw.num_count}}`);
export async function validateAndHashPassword(pw: string): Promise<string> {
    let pass = bcrypt.hash(pw, config.auth.salt);
    if (pw.length < config.auth.pw.length)
        return Promise.reject(
            `Not long enough, should be at least ${
                config.auth.pw.length
            } character${config.auth.pw.length > 1 ? "s" : ""}`,
        );

    if (!numberRegEx.test(pw))
        return Promise.reject(
            `Not enough numbers supplied, there should be at least ${
                config.auth.pw.num_count
            } number${config.auth.pw.num_count > 1 ? "s" : ""}`,
        );

    if (!specialCharRegEx.test(pw))
        return Promise.reject(
            `Not enough special characters, there should be at least ${
                config.auth.pw.special_count
            } special character${config.auth.pw.special_count > 1 ? "s" : ""}`,
        );

    return await pass;
}

export default class AuthController {
    static login = async (
        username: string,
        password: string,
    ): Promise<Result<string>> => {
        return await validateAndHashPassword(password).then(
            async (encrypt) => {
                try {
                    return await prisma.user
                        .findUniqueOrThrow({
                            where: { username, user_password: encrypt },
                            select: { user_id: true, username: true },
                        })
                        .then(
                            (res: { user_id: number; username: string }) =>
                                generateJWTToken({
                                    userId: res.user_id,
                                    username: res.username,
                                })
                        );
                } catch (e) {
                    return new Err(401, "User does not exist");
                }
            },
            (e) => new Err(406, `Password not valid: ${e}`),
        );
    };

    static signUp = async (
        username: string,
        password: string,
    ): Promise<Result<string>> => {
        return await validateAndHashPassword(password).then(
            async (encrypt) => {
                try {
                    await prisma.user.findFirstOrThrow({
                        where: { username },
                    });
                    return new Err(409, "Username exists");
                } catch (e) {
                    // Add user
                    let { user_id: userId } = await prisma.user.create({
                        data: {
                            username,
                            user_password: encrypt,
                        },
                    });
                    return generateJWTToken({ userId, username });
                }
            },
            (e) => new Err(406, `Password not valid: ${e}`),
        );
    };
}
