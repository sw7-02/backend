import { Err, Result } from "../lib";
import prisma from "../prisma";
import { _Session } from "./CourseController";
import ExerciseController from "./ExerciseController";

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
        const deleteSession = await this.deleteSessionTransactions(sessionId);
        if (deleteSession instanceof Err) return deleteSession;

        return prisma.$transaction(deleteSession).then(
            () => {},
            (reason) => {
                console.error(`Failed deleting session: ${reason}`);
                return new Err(500, "Failed deleting session");
            },
        );
    };

    static deleteSessionTransactions = async (sessionId: number) => {
        const cond = {
            where: {
                session_id: sessionId,
            },
        };
        let e = await prisma.exercise.findMany(cond).then(
            (res) => res.map((r) => r.exercise_id),
            (reason) => {
                console.error(
                    `Failed getting exercises for session to be deleted: ${reason}`,
                );
                return new Err(
                    500,
                    "Failed getting exercises for session to be deleted",
                );
            },
        );

        if (e instanceof Err) return e;
        let exercises = [];

        for (const num of e) {
            (await ExerciseController.deleteExerciseTransactions(num)).forEach(
                exercises.push,
            );
        }

        exercises.push(prisma.session.delete(cond));
        //const c = prisma.session.delete(cond);
        //const e = prisma.exercise.deleteMany(cond);

        return exercises;
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
