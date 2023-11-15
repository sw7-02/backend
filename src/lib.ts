import * as jwt from "jsonwebtoken";
import config from "./config";

type Error = {
    code: number;
    msg: string;
};

function err(code: number, msg: string): Error {
    return { code, msg };
}

type Result = string | Error;

type JWTPayload = {
    user_id: number;
    username: string;
};

const generateJWTToken = (payload: JWTPayload): string =>
    jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.deadline,
    });

export { err, Error, Result, generateJWTToken };
