import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";

/// Checks given JWT in the header of the requests, serves a new with a deadline of the provided config
export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["auth"];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwt.jwtSecret);
        res.locals.jwtPayload = jwtPayload;

    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        return;
    }

    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username}, config.jwt.jwtSecret, {
        expiresIn: config.jwt.jwtDeadline,
    });
    res.setHeader("auth-token", newToken);

    //Call the next middleware or controller
    next();
};