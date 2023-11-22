import prisma from "../prisma";
import * as bcrypt from "bcryptjs";
import config from "../config";
import { err, Result } from "../lib";
import { generateJWTToken } from "../lib";

const specialCharRegEx = new RegExp("^[!@#$%^&*()]+$");
const numberRegEx = new RegExp("^[0-9]+$");

type Exercise = {
    exercise_id: number;
    title: string;
    description: string;
    code_template: string;
    points: number;
    hints: string[];
    test_case: string[];
};

export default class ExerciseController {
    static retrieveExercise = async (
        exerciseId: number,
    ): Promise<Result<Exercise>> => {
        try {
            return await prisma.exercise
                .findUniqueOrThrow({
                    where: {
                        exercise_id: exerciseId,
                    },
                    select: {
                        exercise_id: true,
                        title: true,
                        description: true,
                        code_template: true,
                        hints: {
                            select: {
                                description: true,
                            },
                            orderBy: {
                                order: "asc",
                            },
                        },
                        points: true,
                        test_case: {
                            where: {
                                is_visible: true,
                            },
                            select: {
                                code: true,
                            },
                        },
                    },
                })
                .then(
                    (res) => {
                        const {
                            exercise_id,
                            title,
                            description,
                            hints,
                            code_template,
                            points,
                            test_case,
                        } = res;
                        return {
                            exercise_id,
                            title,
                            description,
                            code_template,
                            points,
                            hints: hints.map((h) => h.description),
                            test_case: test_case.map((t) => t.code),
                        };
                    },
                    () => err(500, "Internal error"),
                );
        } catch {
            return err(401, "Exercise does not exist");
        }
    };

    static submitExerciseSolution = async (
        exerciseId: number,
        userId: number,
        solution: string,
        isAnon: boolean = false,
    ): Promise<Result<void>> => {
        try {
            await prisma.exerciseSolution.upsert({
                where: {
                    user_id_exercise_id: {
                        user_id: userId,
                        exercise_id: exerciseId,
                    },
                },
                update: { solution, is_anonymous: isAnon, is_pinned: false },
                create: {
                    exercise_id: exerciseId,
                    user_id: userId,
                    solution,
                    is_anonymous: isAnon,
                },
            });
        } catch {
            return err(500, "Internal error"); //TODO: What happens?
        }
    };
    static addExercise = async (
        sessionId: number,
        title: string,
        description: string,
        points: number,
        programmingLanguage: string,
        codeTemplate: string,
        hints: string[] = [],
    ): Promise<Result<number>> => {
        try {
            let order = 1; //TODO: zero-index?
            return (
                await prisma.exercise.create({
                    data: {
                        session: {
                            connect: {
                                session_id: sessionId,
                            },
                        },
                        title,
                        description,
                        points,
                        programming_language: programmingLanguage,
                        code_template: codeTemplate,
                        hints: {
                            createMany: {
                                data: hints.map((h) => {
                                    return { description: h, order: order++ };
                                }),
                            },
                        },
                    },
                    select: {
                        exercise_id: true,
                    },
                })
            ).exercise_id;
        } catch {
            return err(401, "Session does not exist");
        }
    };
}
