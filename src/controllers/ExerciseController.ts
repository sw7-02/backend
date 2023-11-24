import prisma from "../prisma";
import { Err, Result } from "../lib";

type _Exercise = {
    exercise_id: number;
    title: string;
    description: string;
    code_template: string;
    programming_language: string;
    points: number;
    hints: string[];
    test_case: string[];
};

type _ExerciseSolution = {
    solution: string;
    is_pinned: boolean;
    username: string;
};

export default class ExerciseController {
    static retrieveAllExercises = async (
        sessionId: number,
    ): Promise<Result<_Exercise[]>> =>
        prisma.session
            .findUniqueOrThrow({
                where: { session_id: sessionId },
                select: {
                    exercises: {
                        select: {
                            exercise_id: true,
                            title: true,
                            description: true,
                            code_template: true,
                            programming_language: true,
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
                    },
                },
            })
            .then(
                (res) => {
                    if (res.exercises.length === 0) {
                        console.error(`No exercises in session`);
                        return new Err(404, "No exercises in session");
                    } else
                        return res.exercises.map((r) => {
                            const {
                                exercise_id,
                                title,
                                description,
                                programming_language,
                                hints,
                                code_template,
                                points,
                                test_case,
                            } = r;
                            return {
                                exercise_id,
                                title,
                                description,
                                programming_language,
                                code_template,
                                points,
                                hints: hints.map((h) => h.description),
                                test_case: test_case.map((t) => t.code),
                            };
                        });
                },
                (r) => {
                    console.error(`Failure getting session ${sessionId}: ${r}`);
                    return new Err(404, "Session does not exist");
                },
            );

    static retrieveExercise = async (
        exerciseId: number,
    ): Promise<Result<_Exercise>> =>
        prisma.exercise
            .findUniqueOrThrow({
                where: {
                    exercise_id: exerciseId,
                },
                select: {
                    exercise_id: true,
                    title: true,
                    description: true,
                    programming_language: true,
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
                        programming_language,
                        hints,
                        code_template,
                        points,
                        test_case,
                    } = res;
                    return {
                        exercise_id,
                        title,
                        description,
                        programming_language,
                        code_template,
                        points,
                        hints: hints.map((h) => h.description),
                        test_case: test_case.map((t) => t.code),
                    };
                },
                (r) => {
                    console.error(
                        `Failure getting exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );

    static submitExerciseSolution = async (
        exerciseId: number,
        userId: number,
        solution: string,
        isAnon: boolean = true,
    ): Promise<Result<void>> =>
        prisma.exerciseSolution
            .upsert({
                where: {
                    user_id_exercise_id: {
                        user_id: userId,
                        exercise_id: exerciseId,
                    },
                },
                update: {
                    exercise_id: exerciseId,
                    user_id: userId,
                    solution,
                    is_anonymous: isAnon,
                    is_pinned: false,
                },
                create: {
                    exercise: {
                        connect: {
                            exercise_id: exerciseId,
                        },
                    },
                    user: {
                        connect: {
                            user_id: userId,
                        },
                    },
                    solution,
                    is_anonymous: isAnon,
                },
            })
            .then(
                () => {},
                (r) => {
                    console.error(
                        `Failure submitting exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(500, "Internal error"); //TODO: What happens?
                },
            );

    static retrieveAllExerciseSolutions = async (
        exerciseId: number,
    ): Promise<Result<_ExerciseSolution[]>> =>
        prisma.exercise
            .findUniqueOrThrow({
                where: { exercise_id: exerciseId },
                include: {
                    solutions: {
                        select: {
                            solution: true,
                            is_anonymous: true,
                            is_pinned: true,
                            user: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                        orderBy: [
                            { exercise_solution_id: "desc" },
                            { is_pinned: "desc" },
                        ],
                    },
                },
            })
            .then(
                (res) =>
                    res.solutions.map((r) => {
                        const { solution, is_pinned } = r;
                        const username = r.is_anonymous
                            ? "Anonymous"
                            : r.user.username;
                        return {
                            solution,
                            is_pinned,
                            username,
                        };
                    }),
                (r) => {
                    console.error(
                        `Failure getting exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );

    static addExercise = async (
        sessionId: number,
        title: string,
        description: string,
        points: number,
        programmingLanguage: string,
        codeTemplate: string,
        hints: string[] = [],
        testCases: string[] = [],
    ): Promise<Result<number>> => {
        let order = 1; //TODO: zero-index?
        return prisma.exercise
            .create({
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
                    test_case: {
                        createMany: {
                            data: testCases.map((c) => {
                                return { code: c, is_visible: false }; // TODO: get if visible
                            }),
                        },
                    },
                },
                select: {
                    exercise_id: true,
                },
            })
            .then(
                (e) => e.exercise_id,
                (r) => {
                    console.error(`Failure trying to add exercise: ${r}`);
                    return new Err(404, "Session does not exist");
                },
            );
    };

    static deleteExercise = async (exerciseId: number): Promise<Result<void>> =>
        prisma.exercise
            .delete({
                where: {
                    exercise_id: exerciseId,
                },
            })
            .then(
                () => {},
                (r) => {
                    console.error(
                        `Failure deleting exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );
}
