import * as jwt from "jsonwebtoken";
import config from "./config";
import axios from "axios";

class Err {
    code: number;
    msg: string | object;

    constructor(code: number, msg: string | object) {
        this.code = code;
        this.msg = msg;
    }
}

type Result<T, E = Err> = T | E;

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

export { Err, Result, generateJWTToken, Role };
