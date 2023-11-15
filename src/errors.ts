type Error = {
    code: number;
    msg: string;
};

function err(code: number, msg: string): Error {
    return { code, msg };
}

type Result = string | Error;

export { err, Error, Result };
