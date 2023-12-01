import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export default function roleCheck(roles: number[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user_id = res.locals.jwtPayload.userId;
        const course_id = res.locals.courseId;
        await prisma.enrollment
            .findUniqueOrThrow({
                where: {
                    user_id_course_id: {
                        course_id,
                        user_id,
                    },
                },
                select: {
                    user_role: true,
                },
            })
            .then(
                ({ user_role }) => {
                    if (roles.includes(user_role)) {
                        next();
                    } else {
                        res.statusMessage =
                            "You don't have the authorized role for this action";
                        res.status(401).send();
                    }
                },
                (e) => {
                    console.error(
                        `Fail role check for ${res.locals.jwtPayload.username}: ${e}`,
                    );
                    res.statusMessage = "Enrollment does not exist";
                    res.status(404).send();
                },
            );
    };
}

export const isTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => res.locals.isTeacher;
