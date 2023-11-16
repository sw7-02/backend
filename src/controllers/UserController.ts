import { Request, Response } from "express";
import prisma from "../prisma";
import { err, Result } from "../lib";

type Course = { course_id: number; title: string };

export default class UserController {
    static getAttendingCourses = async (
        userId: number,
    ): Promise<Result<Course[]>> =>
        prisma.course
            .findMany({
                where: {
                    enrollments: {
                        some: {
                            user_id: userId,
                        },
                    },
                },
            })
            .catch((r) => err(500, `Internal error: ${r}`));

    // TODO: hvad når de har kort det, hvordan husker vi at det kode de sender er korrekt? Skal vi køre det igen før vi submitter fr?
    static submitExerciseSolution = async (
        userId: number,
        exerciseId: number,
        solution: string,
    ): Promise<Result<void>> => {
        prisma.exerciseSolution
            .upsert({
                where: {
                    exercise_id_user_id: {
                        user_id: userId,
                        exercise_id: exerciseId,
                    },
                },
                create: {
                    user_id: userId,
                    exercise_id: exerciseId,
                    solution,
                },
                update: {
                    solution,
                },
            })
            .catch((r) => err(500, `Internal error: ${r}`));
    };

    static setPublicExerciseSolution = async (
        userId: number,
        exerciseId: number,
        isPublic: boolean,
    ): Promise<Result<void>> => {
        prisma.exerciseSolution
            .update({
                where: {
                    exercise_id_user_id: {
                        user_id: userId,
                        exercise_id: exerciseId,
                    },
                },
                data: {
                    is_public: isPublic,
                },
            })
            .catch((r) => err(500, `Internal error: ${r}`));
    };

    //TODO: Remember role middleware on this
    static setPinnedExerciseSolution = async (
        exerciseSolutionId: number,
        isPinned: boolean,
    ): Promise<Result<void>> => {
        prisma.exerciseSolution
            .update({
                where: {
                    exercise_solution_id: exerciseSolutionId,
                },
                data: {
                    is_pinned: isPinned,
                },
            })
            .catch((r) => err(500, `Internal error: ${r}`));
    };

    static getPublicExerciseSolutions = async (
        exerciseId: number,
        isPinned: boolean,
    ): Promise<Result<any>> =>
        prisma.exerciseSolution
            .findMany({
                where: {
                    exercise_id: exerciseId,
                    is_public: true,
                },
                select: {
                    solution: true,
                    is_pinned: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
                orderBy: {
                    is_pinned: "desc",
                },
            }) //TODO: Map anon and check for ordering (might be asc on booleans)
            .then((es) =>
                es.map((ex) => {
                    const { solution, is_pinned } = ex;
                    const username = ex.user.username;

                    return { solution, is_pinned, username };
                }),
            )
            .catch((r) => err(500, `Internal error: ${r}`));
}
