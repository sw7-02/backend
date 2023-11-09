import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";

/// Checks given JWT in the header of the requests, serves a new with a deadline of the provided config
export const validateJWT = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    //Get the jwt token from the header
    const token = <string>req.headers["auth"];
    let jwtPayload;

    //Validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwt.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, 401 (unauthorized)
        res.status(401).send();
        return;
    }

    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    res.setHeader(
        "auth-token",
        jwt.sign({ userId, username }, config.jwt.jwtSecret, {
            expiresIn: config.jwt.jwtDeadline,
        }),
    );

    //Call the next middleware or controller
    next();
};
