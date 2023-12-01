import prisma from "../prisma";
import { Err, Result, Role } from "../lib";
import SessionController from "./SessionController";
import ExerciseController from "./ExerciseController";

type _ExerciseIdentifier = {
    title: string;
    exercise_id: number;
};

type _SessionIdentifier = {
    session_id: number;
    title: string;
};

export type _Session = {
    session_id: number;
    title: string;
    exercises: _ExerciseIdentifier[];
};

type _Course = {
    course_id: number;
    title: string;
    sessions: _SessionIdentifier[];
};

type _CourseFull = {
    course_id: number;
    title: string;
    sessions: _Session[];
};

// sorted
type _Leaderboard = {
    username: string;
    total_points: number;
}[];

type _CourseOverview = {
    course_id: number;
    title: string;
    user_role: Role;
}[];

export default class CourseController {
    static createCourse = async (
        title: string,
        teacherId: number,
    ): Promise<Result<{ course_id: number }>> => {
        title = title.trim();
        if (!title) return new Err(406, "Title is needed");
        else
            return prisma.course
                .create({
                    data: {
                        title: title,
                        enrollments: {
                            create: {
                                user_id: teacherId,
                                user_role: Role.TEACHER,
                            },
                        },
                    },
                    select: {
                        course_id: true,
                    },
                })
                .catch((reason) => {
                    console.error(`Failed creating new course: ${reason}`);
                    return new Err(500, "Failed creating new course");
                });
    };

    static deleteCourse = async (courseId: number): Promise<Result<void>> => {
        const transactions = await this.deleteCourseTransactions(courseId);
        if (transactions instanceof Err) return transactions;
        return prisma.$transaction(transactions).then(
            () => {},
            (reason) => {
                console.error(`Failed deleting course: ${reason}`);
                return new Err(500, "Failed deleting course");
            },
        );
    };

    static deleteCourseTransactions = async (courseId: number) => {
        const cond = {
            where: {
                course_id: courseId,
            },
        };
        const sessions = await prisma.session.findMany(cond).then(
            (res) => res.map((r) => r.session_id),
            (reason) => {
                console.error(
                    `Failed getting sessions for course to be deleted: ${reason}`,
                );
                return new Err(
                    500,
                    "Failed getting sessions for course to be deleted",
                );
            },
        );
        if (sessions instanceof Err) return sessions;
        const assignmens = await prisma.session.findMany(cond).then(
            (res) => res.map((r) => r.session_id),
            (reason) => {
                console.error(
                    `Failed getting sessions for course to be deleted: ${reason}`,
                );
                return new Err(
                    500,
                    "Failed getting sessions for course to be deleted",
                );
            },
        );
        if (assignmens instanceof Err) return assignmens;

        let transactions = [];
        for (const num of sessions) {
            const e = await SessionController.deleteSessionTransactions(num);
            if (e instanceof Err) return e;
            e.forEach(transactions.push);
        }
        // TODO: Same for assignments and both solutions

        transactions.push(prisma.course.delete(cond));
        return transactions;
    };

    static renameCourse = async (
        courseId: number,
        newTitle: string,
    ): Promise<Result<{ course_id: number }>> => {
        newTitle = newTitle.trim();
        if (!newTitle) return new Err(406, "Title is needed");
        else
            return prisma.course
                .update({
                    where: {
                        course_id: courseId,
                    },
                    data: {
                        title: newTitle,
                    },
                    select: {
                        course_id: true,
                    },
                })
                .catch((reason) => {
                    console.error(`Failed renaming course: ${reason}`);
                    return new Err(404, "Course not found");
                });
    };

    static retrieveCourse = async (
        courseId: number,
    ): Promise<Result<_Course>> =>
        prisma.course
            .findUniqueOrThrow({
                where: {
                    course_id: courseId,
                },
                select: {
                    title: true,
                    course_id: true,
                    sessions: {
                        select: {
                            title: true,
                            session_id: true,
                        },
                        orderBy: {
                            session_id: "asc",
                        },
                    },
                },
            })
            .catch((r) => {
                console.error(`Failure getting sessions: ${r}`);
                return new Err(
                    404,
                    "Failed getting sessions: Invalid course ID",
                );
            });

    static retrieveFullCourse = async (
        courseId: number,
    ): Promise<Result<_CourseFull>> =>
        prisma.course
            .findUniqueOrThrow({
                where: {
                    course_id: courseId,
                },
                select: {
                    title: true,
                    course_id: true,
                    sessions: {
                        select: {
                            title: true,
                            session_id: true,
                            exercises: {
                                select: {
                                    title: true,
                                    exercise_id: true,
                                },
                                orderBy: {
                                    exercise_id: "asc",
                                },
                            },
                        },
                        orderBy: {
                            session_id: "asc",
                        },
                    },
                },
            })
            .catch((r) => {
                console.error(`Failure getting sessions: ${r}`);
                return new Err(
                    404,
                    "Failed getting sessions: Invalid course ID",
                );
            });

    static updatePoints = async function (
        courseId: number,
        userId: number,
        exerciseId: number,
    ): Promise<Result<{ total_points: number }>> {
        let points = await prisma.exercise
            .findUniqueOrThrow({
                where: {
                    exercise_id: exerciseId,
                },
                select: {
                    points: true,
                },
            })
            .catch((reason) => {
                console.error(`Failed getting exercise: ${reason}`);
                return new Err(404, "Invalid exercise ID");
            });
        if (points instanceof Err) {
            console.error(`Failed getting points: ${points.msg}`);
            return points;
        }

        return prisma.enrollment
            .update({
                where: {
                    user_id_course_id: {
                        user_id: userId,
                        course_id: courseId,
                    },
                },
                data: {
                    total_points: {
                        increment: points.points,
                    } || {
                        set: points,
                    },
                },
                select: {
                    total_points: true,
                },
            })
            .then(
                (r) => {
                    if (!r.total_points) {
                        console.error(`User with null points: ${userId}`);
                        return new Err(500, "Internal error");
                    } else return { total_points: r.total_points! };
                },
                (reason) => {
                    console.error(`Failed finding enrollment: ${reason}`);
                    return new Err(
                        404,
                        "Failed finding enrollment: User not enrolled, or bad ID provided",
                    );
                },
            );
    };

    static decrementPoints = async function (
        courseId: number,
        userId: number,
        points: number,
    ): Promise<Result<{ total_points: number }>> {
        return prisma.enrollment
            .update({
                where: {
                    user_id_course_id: {
                        user_id: userId,
                        course_id: courseId,
                    },
                },
                data: {
                    total_points: {
                        decrement: points,
                    },
                },
                select: {
                    total_points: true,
                },
            })
            .then(
                (r) => {
                    if (r.total_points === null) {
                        console.error(`User with null points: ${userId}`);
                        return new Err(500, "Internal error");
                    } else return { total_points: r.total_points! };
                },
                (reason) => {
                    console.error(`Failed finding enrollment: ${reason}`);
                    return new Err(
                        404,
                        "Failed finding enrollment: User not enrolled, or bad ID provided",
                    );
                },
            );
    };

    static retrieveLeaderboard = async (
        courseId: number,
        userId: number,
    ): Promise<Result<_Leaderboard>> =>
        prisma.course
            .findUniqueOrThrow({
                where: {
                    course_id: courseId,
                },
                include: {
                    enrollments: {
                        where: {
                            user_role: Role.STUDENT,
                        },
                        select: {
                            total_points: true,
                            is_anonymous: true,
                            user_id: true,
                            user: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                        orderBy: {
                            total_points: "desc",
                        },
                    },
                },
            })
            .then(
                (res) => {
                    const b = res.enrollments.find((r) => !r.total_points);
                    if (b) {
                        console.error(
                            `User with null points: ${b.user.username}`,
                        );
                        return new Err(500, "Internal error");
                    }
                    return res.enrollments.map((r) => {
                        return {
                            total_points: r.total_points!!,
                            username: r.is_anonymous
                                ? "Anonymous" +
                                  (r.user_id === userId ? " (you)" : "")
                                : r.user.username,
                        };
                    });
                },
                (reason) => {
                    console.error(`Failed getting leaderboards: ${reason}`);
                    return new Err(404, "Course does not exist");
                },
            );

    static retrieveEnrolledCourses = async (
        userId: number,
    ): Promise<Result<_CourseOverview>> =>
        prisma.user
            .findUniqueOrThrow({
                where: {
                    user_id: userId,
                },
                select: {
                    enrollments: {
                        select: {
                            user_role: true,
                            course: {
                                select: {
                                    course_id: true,
                                    title: true,
                                },
                            },
                        },
                        orderBy: {
                            course_id: "asc",
                        },
                    },
                },
            })
            .then(
                (res) =>
                    res.enrollments.map((r) => {
                        const { course_id, title } = r.course;
                        return { course_id, title, user_role: r.user_role };
                    }),
                (reason) => {
                    console.error(`Failed getting courses: ${reason}`);
                    return new Err(404, "User does not exist");
                },
            );

    static getAnonymity = async (
        userId: number,
        courseId: number,
    ): Promise<Result<{ is_anonymous: boolean }>> =>
        prisma.enrollment
            .findUniqueOrThrow({
                where: {
                    user_id_course_id: {
                        course_id: courseId,
                        user_id: userId,
                    },
                },
                select: {
                    is_anonymous: true,
                },
            })
            .catch((reason) => {
                console.error(`Failed finding anonymity: ${reason}`);
                return new Err(404, "Course or User does not exist");
            });
    static setAnonymity = async (
        userId: number,
        courseId: number,
        anon: boolean,
    ): Promise<Result<void>> =>
        prisma.enrollment
            .update({
                where: {
                    user_id_course_id: {
                        course_id: courseId,
                        user_id: userId,
                    },
                },
                data: {
                    is_anonymous: anon,
                },
            })
            .then(
                () => {},
                (reason) => {
                    console.error(`Failed setting anonymity: ${reason}`);
                    return new Err(404, "Course or User does not exist");
                },
            );
}
