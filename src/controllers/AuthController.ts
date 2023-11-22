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
                return prisma.user
                    .findUniqueOrThrow({
                        where: { username },
                        select: {
                            user_id: true,
                            username: true,
                            user_password: true,
                        },
                    })
                    .then(
                        (res: {
                            user_id: number;
                            username: string;
                            user_password: string;
                        }) => {
                            if (res.user_password != encrypt) {
                                console.log(password);
                                console.log(encrypt);
                                console.log(res.user_password);
                                console.error(
                                    `Attempt login on user ${username} (wrong password)`,
                                );
                                return new Err(401, "Wrong password");
                            }
                            return generateJWTToken({
                                userId: res.user_id,
                                username: res.username,
                            });
                        },
                        (e) => {
                            console.error(
                                `Fail logging in user ${username}: ${e}`,
                            );
                            return new Err(401, `Username does not exist`);
                        },
                    );
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
                return prisma.user
                    .findFirstOrThrow({
                        where: { username },
                    })
                    .then(
                        () => new Err(409, "Username exists"),
                        async () => {
                            let { user_id: userId } = await prisma.user.create({
                                data: {
                                    username,
                                    user_password: encrypt,
                                },
                            });
                            return generateJWTToken({ userId, username });
                        },
                    );
            },
            (e) => new Err(406, `Password not valid: ${e}`),
        );
    };
}
