import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export default function roleCheck(roles: number[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.jwtPayload.userId;
        const courseId = parseInt(req.params.course_id);
        const user = await prisma.enrollment.findFirstOrThrow({
            where: {
                course_id: 1,
                user_id: userId,
            },
            select: {
                user_role: true,
            },
        });

        if (roles.indexOf(user.user_role) > -1) {
            next();
        } else {
            res.status(401).send();
        }
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
