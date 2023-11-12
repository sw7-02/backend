import prisma from "../prisma";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import config from "../config";
import * as jwt from "jsonwebtoken";

//TODO: Check for length, numbers, special character, etc.
async function validateAndHashPassword(pw: string): Promise<string> {
    return bcrypt.hash(pw, config.auth.salt);
}

async function login(req: Request, res: Response) {
    let { username, password } = req.body;
    if (!(username && password)) {
        res.status(400).send();
    }
    await validateAndHashPassword(password).then(
        async (encrypt) => {
            try {
                await prisma.user
                    .findFirstOrThrow({
                        where: { username, password: encrypt },
                        select: { user_id: true, username: true },
                    })
                    .then(
                        ({ user_id, username }) => {
                            res.setHeader(
                                config.jwt.jwtHeader,
                                jwt.sign(
                                    { user_id, username },
                                    config.jwt.jwtSecret,
                                    {
                                        expiresIn: config.jwt.jwtDeadline,
                                    },
                                ),
                            );
                            res.send();
                        },
                        (_) => res.status(500).send(),
                    );
            } catch (e) {
                res.status(301).send("Username does not exist");
            }
        },
        (e) => res.status(301).send(`Password not valid: ${e}`),
    );
}

async function signUp(req: Request, res: Response) {
    let { username, password } = req.body;
    if (!(username && password)) {
        res.status(400).send();
    }

    await validateAndHashPassword(password).then(
        async (encrypt) => {
            try {
                await prisma.user
                    .findFirstOrThrow({
                        where: { username },
                    })
                    .finally(() => res.status(409).send("Username exists"));
            } catch (e) {
                // Add user
                let { user_id } = await prisma.user.create({
                    data: {
                        username,
                        password: encrypt,
                    },
                });
                res.setHeader(
                    config.jwt.jwtHeader,
                    jwt.sign({ user_id, username }, config.jwt.jwtSecret, {
                        expiresIn: config.jwt.jwtDeadline,
                    }),
                );
                res.send(`User ${username} created!`);
            }
        },
        (e) => res.status(301).send(`Password not valid: ${e}`),
    );
}

export { login, signUp };
