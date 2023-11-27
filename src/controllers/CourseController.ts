import prisma from "../prisma";
import { Err, Result, Role } from "../lib";

type _ExerciseIdentifier = {
    title: string;
    exercise_id: number;
};

type _SessionIdentifier = {
    session_id: number;
    title: string;
};

type _Session = {
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
                    },
                },
            })
            .then(
                (res) => res,
                (r) => {
                    console.error(`Failure getting sessions: ${r}`);
                    return new Err(
                        404,
                        "Failed getting sessions: Invalid course ID",
                    );
                },
            );

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
                            },
                        },
                    },
                },
            })
            .then(
                (res) => res,
                (r) => {
                    console.error(`Failure getting sessions: ${r}`);
                    return new Err(
                        404,
                        "Failed getting sessions: Invalid course ID",
                    );
                },
            );

    static updatePoints = async function (
        courseId: number,
        userId: number,
        exerciseId: number,
    ): Promise<Result<number>> {
        let points = await prisma.exercise
            .findUniqueOrThrow({
                where: {
                    exercise_id: exerciseId,
                },
                select: {
                    points: true,
                },
            })
            .then(
                (r) => r.points,
                (reason) => {
                    console.error(`Failed getting exercise: ${reason}`);
                    return new Err(404, "Invalid exercise ID");
                },
            );
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
                        increment: points,
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
                    } else return r.total_points;
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
    ): Promise<Result<number>> {
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
                    if (!r.total_points) {
                        console.error(`User with null points: ${userId}`);
                        return new Err(500, "Internal error");
                    } else return r.total_points;
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
    ): Promise<Result<_Leaderboard>> =>
        prisma.course
            .findUniqueOrThrow({
                where: {
                    course_id: courseId,
                },
                select: {
                    enrollments: {
                        where: {
                            user_role: Role.STUDENT,
                        },
                        select: {
                            total_points: true,
                            user: {
                                select: {
                                    username: true,
                                    //TODO: Anon?
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
                            username: r.user.username,
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
}
