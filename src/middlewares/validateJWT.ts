import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import { generateJWTToken } from "../lib";

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
        jwtPayload = <any>jwt.verify(token, config.jwt.secret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, 401 (unauthorized)
        res.status(401).send();
        console.error(`Invalid JWT: ${error}`);
        return;
    }

    //We want to send a new token on every request
    res.setHeader(config.jwt.header, generateJWTToken(jwtPayload));

    //Call the next middleware or controller
    next();
};
