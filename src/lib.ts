import * as jwt from "jsonwebtoken";
import config from "./config";
import axios from "axios";

class Err {
    code: number;
    msg: string;

    constructor(code: number, msg: string) {
        this.code = code;
        this.msg = msg;
    }
}

type Result<T, E> = T | E;

type ResponseResult<T> = Result<T, Err>;

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

async function executeTest(): Promise<Result<void, any>> {
    // TODO: test-runner api
    return axios.get(config.server.test_runner, {
        //timeout: 2000,
    }).then(function (r) {
            if (r.status in [200, 201])
                return;
            else
                return new Err(r.status, r.data)
        }).catch(r => new Err(500, r.data));
}

export { Err, ResponseResult, Result, generateJWTToken, Role };
