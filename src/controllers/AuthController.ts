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

type PW = { hash: string; salt: string };
function genPass(pw: string, username: string): PW {
    const salt = bcrypt.genSaltSync(username.length);
    return { hash: bcrypt.hashSync(pw, salt), salt };
}

export type AuthRes = {
    jwt_token: string;
    is_teacher: boolean;
};

export default class AuthController {
    static login = async (
        username: string,
        password: string,
    ): Promise<Result<AuthRes>> => {
        const valid = validatePassword(password);
        if (valid instanceof Err)
            return new Err(valid.code, `Password not valid: ${valid.msg}`);

        return prisma.user
            .findUniqueOrThrow({
                where: { username },
                select: {
                    user_id: true,
                    username: true,
                    user_password: true,
                    is_teacher: true,
                },
            })
            .then(
                ({ user_id, username, user_password, is_teacher }) => {
                    if (!bcrypt.compareSync(password, user_password)) {
                        console.error(
                            `Attempt login on user ${username} (wrong password)`,
                        );
                        return new Err(401, "Wrong password");
                    }
                    return {
                        jwt_token: generateJWTToken({
                            userId: user_id,
                            username,
                        }),
                        is_teacher,
                    };
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
    ): Promise<Result<AuthRes>> => {
        function valid(username: string) {
            const trimmed = username.trim();
            return (
                !trimmed &&
                username === trimmed &&
                !numberRegEx.test(username.charAt(0)) &&
                !specialCharRegEx.test(username)
            );
        }

        if (!valid(username)) return new Err(406, "Username invalid");
        return prisma.user
            .findFirstOrThrow({
                where: { username },
            })
            .then(
                () => new Err(409, "Username exists"),
                async () => {
                    const valid = validatePassword(password);
                    if (valid instanceof Err)
                        return new Err(
                            valid.code,
                            `Password not valid: ${valid.msg}`,
                        );
                    const { hash, salt } = genPass(password, username);
                    let { user_id: userId } = await prisma.user.create({
                        data: {
                            username,
                            user_password: hash,
                            pw_salt: salt,
                        },
                    });
                    return {
                        jwt_token: generateJWTToken({ userId, username }),
                        is_teacher: false,
                    };
                },
            );
    };
}
