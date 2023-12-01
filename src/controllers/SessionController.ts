import { Err, Result } from "../lib";
import prisma from "../prisma";
import { _Session } from "./CourseController";

export default class SessionController {
    static retrieveSessionFromCourse = async (
        sessionId: number,
    ): Promise<Result<_Session>> =>
        prisma.session
            .findUniqueOrThrow({
                where: {
                    session_id: sessionId,
                },
                select: {
                    session_id: true,
                    title: true,
                    exercises: {
                        select: {
                            exercise_id: true,
                            title: true,
                        },
                    },
                },
            })
            .catch((reason) => {
                console.error(`Failed getting session: ${reason}`);
                return new Err(404, "Session does not exist");
            });

    static insertSessionFromCourse = async (
        courseId: number,
        title: string,
    ): Promise<Result<{ session_id: number }>> => {
        title = title.trim();
        if (!title) return new Err(406, "Title missing");
        else
            return prisma.session
                .create({
                    data: {
                        title: title,
                        course: {
                            connect: {
                                course_id: courseId,
                            },
                        },
                    },
                    select: {
                        session_id: true,
                    },
                })
                .catch((reason) => {
                    console.error(
                        `Failed adding session to course ${courseId}: ${reason}`,
                    );
                    return new Err(400, "Failed adding new session");
                });
    };

    static deleteSessionFromCourse = async (
        sessionId: number,
    ): Promise<Result<void>> => {
        const cond = {
            where: {
                session_id: sessionId,
            },
        };
        const c = prisma.session.delete(cond);
        const e = prisma.exercise.deleteMany(cond);

        return prisma.$transaction([e, c]).then(
            () => {},
            (reason) => {
                console.error(`Failed deleting session: ${reason}`);
                return new Err(500, "Failed deleting session");
            },
        );
    };

    static renameSessionFromCourse = async (
        sessionId: number,
        newTitle: string,
    ): Promise<Result<{ session_id: number }>> => {
        newTitle = newTitle.trim();
        if (!newTitle) return new Err(406, "Title missing");
        else
            return prisma.session
                .update({
                    where: {
                        session_id: sessionId,
                    },
                    data: {
                        title: newTitle,
                    },
                    select: {
                        session_id: true,
                    },
                })
                .catch((reason) => {
                    console.error(`Failed renaming session: ${reason}`);
                    return new Err(404, "Session not found");
                });
    };
}
