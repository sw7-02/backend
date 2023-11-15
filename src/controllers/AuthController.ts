import prisma from "../prisma";
import * as bcrypt from "bcryptjs";
import config from "../config";
import * as jwt from "jsonwebtoken";
import { err, Result } from "../errors";

async function validateAndHashPassword(pw: string): Promise<string> {
    //TODO: Check for length, numbers, special character, etc.
    return bcrypt.hash(pw, config.auth.salt);
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
                                jwt.sign(
                                    { user_id, username },
                                    config.jwt.jwtSecret,
                                    {
                                        expiresIn: config.jwt.jwtDeadline,
                                    },
                                ),
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
                    return jwt.sign(
                        { user_id, username },
                        config.jwt.jwtSecret,
                        {
                            expiresIn: config.jwt.jwtDeadline,
                        },
                    );
                }
            },
            (e) => err(301, `Password not valid: ${e}`),
        );
    };
}
