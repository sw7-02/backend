import prisma from "../prisma";
import * as bcrypt from "bcryptjs";
import config from "../config";
import { Err, Result } from "../lib";
import { generateJWTToken } from "../lib";

const specialCharRegEx = new RegExp(
    `[!@#$%^&*()]{${config.auth.pw.special_count}}`,
);
const numberRegEx = new RegExp(`([0-9].*){${config.auth.pw.num_count}}`);

export function validatePassword(pw: string): Result<void> {
    const code = 406;
    if (pw.length < config.auth.pw.length)
        return new Err(
            code,
            `Not long enough, should be at least ${
                config.auth.pw.length
            } character${config.auth.pw.length > 1 ? "s" : ""}`,
        );

    if (!numberRegEx.test(pw))
        return new Err(
            code,
            `Not enough numbers supplied, there should be at least ${
                config.auth.pw.num_count
            } number${config.auth.pw.num_count > 1 ? "s" : ""}`,
        );

    if (!specialCharRegEx.test(pw))
        return new Err(
            code,
            `Not enough special characters, there should be at least ${
                config.auth.pw.special_count
            } special character${config.auth.pw.special_count > 1 ? "s" : ""}`,
        );
}

function genPass(pw: string, username: string): string {
    const salt = bcrypt.hashSync(username, config.auth.salt);
    return bcrypt.hashSync(pw, salt);
}

export default class AuthController {
    static login = async (
        username: string,
        password: string,
    ): Promise<Result<string>> => {
        const valid = validatePassword(password);
        if (valid instanceof Err)
            return {
                code: valid.code,
                msg: `Password not valid: ${valid.msg}`,
            };

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
                    if (
                        !bcrypt.compareSync(
                            genPass(password, username),
                            user_password,
                        )
                    ) {
                        console.log(password);
                        console.log(genPass(password, username));
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
                    console.error(`Fail logging in user ${username}: ${e}`);
                    return new Err(401, `Username does not exist`);
                },
            );
    };

    static signUp = async (
        username: string,
        password: string,
    ): Promise<Result<string>> => {
        const valid = validatePassword(password);
        if (valid instanceof Err)
            return {
                code: valid.code,
                msg: `Password not valid: ${valid.msg}`,
            };
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
                            user_password: genPass(password, username),
                        },
                    });
                    return generateJWTToken({ userId, username });
                },
            );
    };
}
