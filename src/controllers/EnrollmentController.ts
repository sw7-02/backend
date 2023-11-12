import { Request, Response } from "express";
import prisma from "../prisma";


async function getAttendingCourses(req: Request, res: Response) {
    let user_id = res.locals.jwtPayload.userId;

    await prisma.enrollments
        .findMany({
            where: {
                user: user_id,
            },
            select: {
                course: {
                    select: {
                        course_id: true,
                        name: true,
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

    await prisma.enrollments.create({ //TODO: needs to be User and Course types
        data: {
            user: user_id, course: course_id
        }
    })
}

export {getAttendingCourses, enroll};