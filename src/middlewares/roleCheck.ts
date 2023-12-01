import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export default function roleCheck(roles: number[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user_id = res.locals.jwtPayload.userId;
        const course_id = res.locals.courseId;
        if (roles.includes(res.locals.userRole)) {
            next();
        } else {
            res.status(401).send(
                "You don't have the authorized role for this action",
            );
            return;
        }
    };
}

export const isTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.locals.isTeacher) next();
    else {
        res.status(401).send("You are not a teacher");
        return;
    }
};
