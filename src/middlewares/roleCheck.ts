import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export default function roleCheck(roles: number[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (roles.includes(res.locals.userRole)) {
            next();
        } else {
            console.error(
                `User tried to access resource with role ${res.locals.userRole}. Allowed roles: ${roles}`,
            );
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
