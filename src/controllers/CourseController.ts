import prisma from "../prisma";
import { Err, ResponseResult, Role } from "../lib";

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
}[];

export default class CourseController {
    static retrieveCourse = async (
        courseId: number,
    ): Promise<ResponseResult<_Course>> =>
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
    ): Promise<ResponseResult<_CourseFull>> =>
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
    ): Promise<ResponseResult<number>> {
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
        exerciseId: number,
        points: number,
    ): Promise<ResponseResult<number>> {
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
    ): Promise<ResponseResult<_Leaderboard>> =>
        prisma.enrollment
            .findMany({
                where: {
                    course_id: courseId,
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
                    total_points: "asc",
                },
            })
            .then(
                (res) => {
                    const b = res.find((r) => !r.total_points);
                    if (b) {
                        console.error(
                            `User with null points: ${b.user.username}`,
                        );
                        return new Err(500, "Internal error");
                    }
                    return res.map((r) => {
                        return {
                            total_points: r.total_points!!,
                            username: r.user.username,
                        };
                    });
                },
                (reason) => {
                    console.error(`Failed getting leaderboards: ${reason}`);
                    return new Err(404, "Bad Course ID");
                },
            );

    static retrieveEnrolledCourses = async (
        userId: number,
    ): Promise<ResponseResult<_CourseOverview>> =>
        prisma.enrollment
            .findMany({
                where: {
                    user_id: userId,
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
            .then(
                (res) => res.map((r) => r.course),
                (reason) => {
                    console.error(`Failed getting courses: ${reason}`);
                    return new Err(404, "Invalid user");
                },
            );

    static getUserId = async (
        courseId: number,
        username: string,
    ): Promise<ResponseResult<number>> =>
        prisma.enrollment
            .findFirstOrThrow({
                where: {
                    course_id: courseId,
                    user: {
                        username,
                    },
                },
                select: {
                    user_id: true,
                },
            })
            .then(
                (res) => res.user_id,
                (reason) => {
                    console.error(
                        `Failed user not enrolled in course: ${reason}`,
                    );
                    return new Err(404, "User not enrolled in course");
                },
            );
}