import * as jwt from "jsonwebtoken";
import config from "./config";

type Error = {
    code: number;
    msg: string;
};

function err(code: number, msg: string): Error {
    return { code, msg };
}

type Result<T> = T | Error;

type JWTPayload = {
    userId: number;
    username: string;
};

const generateJWTToken = (payload: JWTPayload): string => {
    const { userId, username } = payload;
    return jwt.sign({ userId, username }, config.jwt.secret, {
        expiresIn: config.jwt.deadline,
    });
};

enum Role {
    STUDENT = 0,
    TEACHER = 1,
    TA = 2,
}

export { err, Error, Result, generateJWTToken, Role };
