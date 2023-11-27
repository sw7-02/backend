import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { Err } from "../lib";

export default function roleCheck(roles: number[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user_id = res.locals.jwtPayload.userId;
        const course_id = res.locals.jwtPayload.course_id;
        const user = await prisma.enrollment
            .findUniqueOrThrow({
                where: {
                    user_id_course_id: {
                        course_id, user_id,
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
                        res.status(401).send(
                            "User does not have access to make this request",
                        );
                    }
                },
                (e) => {
                    console.error(
                        `Fail role check for ${res.locals.jwtPayload.username}: ${e}`,
                    );
                    res.status(401).send("Enrollment does not exist");
                },
            );
    };
}

/*async function isTeacher(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.jwtPayload.userId;
        let user = await prisma.user.findUniqueOrThrow({
            where: { user_id: userId },
        });

        if (user.is_teacher == true) {
            next();
        } else {
            res.status(403).send();
        }
    }*/
