import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import { generateJWTToken } from "../lib";
import prisma from "../prisma";

/// Checks given JWT in the header of the requests, serves a new with a deadline of the provided config
export default async function enrollmentCheck(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    //Get the jwt token from the header
    const userId = +res.locals.jwtPayload.userId;
    //TODO: check

    const courseId = +req.params.course_id;
    if (!courseId && courseId > 0) {
        res.status(400).send("Course ID not a valid number");
        return;
    }

    const r = await prisma.enrollment.findUnique({
        where: {
            user_id_course_id: {
                user_id: userId, course_id: courseId,
            },
        },
    });

    if (r) {
        res.locals.courseId = courseId;
        next();
    } else {
        res.status(401).send("No enrollment found");
    }
};
