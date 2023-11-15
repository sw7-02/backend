import { Request, Response } from "express";
import prisma from "../prisma";
import { err, Result } from "../lib";

type Course = { course_id: number; title: string };

export default class UserController {
    static getAttendingCourses = async (
        user_id: number,
    ): Promise<Result<Course[]>> =>
        prisma.course
            .findMany({
                where: {
                    enrollments: {
                        some: {
                            user_id,
                        },
                    },
                },
            })
            .catch((r) => err(500, `Internal error: ${r}`));
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
