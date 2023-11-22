import prisma from "../prisma";
import * as bcrypt from "bcryptjs";
import config from "../config";
import { Err, Result } from "../lib";
import { generateJWTToken } from "../lib";

const specialCharRegEx = new RegExp(
    `[!@#$%^&*()]{${config.auth.pw.special_count}}`,
);
const numberRegEx = new RegExp(`([0-9].*){${config.auth.pw.num_count}}`);
export async function validateAndHashPassword(pw: string, username: string): Promise<string> {
    const salt = bcrypt.hashSync(username, config.auth.salt);
    let pass = bcrypt.hash(pw, salt);
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
        return await validateAndHashPassword(password, username).then(
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
                        ({ user_id, username, user_password }) => {
                            if (!bcrypt.compareSync(password, user_password)) {
                                console.log(password);
                                console.log(encrypt);
                                console.log(user_password);
                                console.error(
                                    `Attempt login on user ${username} (wrong password)`,
                                );
                                return new Err(401, "Wrong password");
                            }
                            return generateJWTToken({
                                userId: user_id,
                                username,
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
        return await validateAndHashPassword(password, username).then(
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
