import { Request, Response } from "express";
import prisma from "../prisma";
import * as jwt from "jsonwebtoken";
import config from "../config";

async function getAttendingCourses(req: Request, res: Response) {
    let user_id = res.locals.jwtPayload.userId;

    await prisma.enrollment
        .findMany({
            where: {
                user: user_id,
            },
            select: {
                course: {
                    select: {
                        course_id: true,
                        title: true,
                    },
                },
            },
        })
        .then((course) => res.send(course));
}

async function enroll(req: Request, res: Response) {
    let user_id = res.locals.jwtPayload.userId;
    let course_id = +req.params.id;
    if (isNaN(course_id)) {
        res.status(404).send("ID is not a number");
        return;
    }

    await prisma.enrollment.create({
        data: {
            user_id,
            course_id,
        },
    });
}

export { getAttendingCourses, enroll };
