import prisma from "../prisma";
import { Err, Result } from "../lib";
import axios from "axios";
import config from "../config";

type _Exercise = {
    exercise_id: number;
    title: string;
    description: string;
    code_template: string;
    programming_language: string;
    points: number;
    hints: string[];
    examples: _Example[];
};

type _ExerciseFull = {
    exercise_id: number;
    title: string;
    description: string;
    code_template: string;
    programming_language: string;
    points: number;
    hints: string[];
    examples: _Example[];
    test_cases: string[];
};

type _ExerciseSolution = {
    solution: string;
    is_pinned: boolean;
    username: string;
};

type _Example = {
    input: string;
    output: string;
};
type _Patch = {
    title?: string;
    description?: string;
    programmingLanguage?: string;
    points?: number;
    codeTemplate?: string;
    hints?: string[];
    testCases?: string[];
    examples?: _Example[];
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
                            examples: {
                                select: {
                                    input: true,
                                    output: true,
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
                                examples,
                            } = r;
                            return {
                                exercise_id,
                                title,
                                description,
                                programming_language,
                                code_template,
                                points,
                                hints: hints.map((h) => h.description),
                                examples,
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
                    examples: {
                        select: {
                            input: true,
                            output: true,
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
                        examples,
                    } = res;
                    return {
                        exercise_id,
                        title,
                        description,
                        programming_language,
                        code_template,
                        points,
                        hints: hints.map((h) => h.description),
                        examples,
                    };
                },
                (r) => {
                    console.error(
                        `Failure getting exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );

    static retrieveExerciseFull = async (
        exerciseId: number,
    ): Promise<Result<_ExerciseFull>> =>
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
                    examples: {
                        select: {
                            input: true,
                            output: true,
                        },
                    },
                    test_case: {
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
                        examples,
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
                        examples,
                        test_cases: test_case.map((t) => t.code),
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
                    return new Err(404, "User or Exercise does not exist");
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
                            { exercise_solution_id: "asc" },
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
        {
            title,
            description,
            points,
            programmingLanguage,
            codeTemplate,
            hints,
            testCases,
            examples,
        }: _Patch,
    ): Promise<Result<{ exercise_id: number }>> => {
        let order = 1;
        if (!title) return new Err(400, "No title supplied");
        return prisma.exercise
            .create({
                data: {
                    session: {
                        connect: {
                            session_id: sessionId,
                        },
                    },
                    title: title,
                    description: description ?? "",
                    points: points ?? 0,
                    programming_language: programmingLanguage ?? "Language",
                    code_template: codeTemplate ?? "",
                    hints: {
                        createMany: {
                            data:
                                hints?.map((h) => {
                                    return { description: h, order: order++ };
                                }) ?? [],
                        },
                    },
                    test_case: {
                        createMany: {
                            data:
                                testCases?.map((c) => {
                                    return { code: c };
                                }) ?? [{code: ""}],
                        },
                    },
                    examples: {
                        createMany: {
                            data:
                                examples?.map(({ input, output }) => {
                                    return { input, output };
                                }) ?? [],
                        },
                    },
                },
                select: {
                    exercise_id: true,
                },
            })
            .then(
                (e) => e,
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
                async () => {
                    await Promise.all([
                        prisma.hint.deleteMany({
                            where: { exercise_id: exerciseId },
                        }),
                        prisma.example.deleteMany({
                            where: { exercise_id: exerciseId },
                        }),
                        prisma.testCase.deleteMany({
                            where: { exercise_id: exerciseId },
                        }),
                    ]);
                },
                (r) => {
                    console.error(
                        `Failure deleting exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );
    static patchExercise = async (
        exerciseId: number,
        {
            hints,
            testCases,
            examples,
            description,
            title,
            points,
            programmingLanguage,
            codeTemplate,
        }: _Patch,
    ): Promise<Result<void>> => {
        let hintOrder = 1;
        let additional = { hints: {}, test_case: {}, examples: {} };
        if (hints)
            additional.hints = {
                deleteMany: {
                    // removes additional, if any
                    exercise_id: exerciseId,
                    order: {
                        gt: hints.length,
                    },
                },
                updateMany: {
                    // updates current
                    where: {
                        exercise_id: exerciseId,
                    },

                    data: {
                        description: hints.at(hintOrder - 1),
                        order: hintOrder++,
                    },
                },
                createMany: {
                    // Creates new if needed
                    data: hints.slice(hintOrder - 1).map((h) => {
                        return {
                            description: h,
                            order: hintOrder++,
                        };
                    }),
                },
            };
        if (testCases)
            additional.test_case = {
                deleteMany: {
                    // removes additional, if any
                    exercise_id: exerciseId,
                },
                createMany: {
                    data: testCases.map((c) => {
                        return { code: c };
                    }),
                },
            };
        if (examples)
            additional.examples = {
                deleteMany: {
                    // removes additional, if any
                    exercise_id: exerciseId,
                },
                createMany: {
                    data: examples,
                },
            };

        return prisma.exercise
            .update({
                where: {
                    exercise_id: exerciseId,
                },
                data: {
                    title,
                    description,
                    programming_language: programmingLanguage,
                    code_template: codeTemplate,
                    points,
                    hints: additional.hints,
                    test_case: additional.test_case,
                    examples: additional.examples,
                },
            })
            .then(
                () => {},
                (r) => {
                    console.error(
                        `Failure patching exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );
    };

    static testExercise = async (
        exerciseId: number,
        solution: string,
    ): Promise<Result<void>> => {
        const testCases = await prisma.exercise
            .findUniqueOrThrow({
                where: {
                    exercise_id: exerciseId,
                },
                select: {
                    programming_language: true,
                    test_case: {
                        select: {
                            code: true,
                            test_case_id: true,
                        },
                    },
                },
            })
            .then(
                (res) => res,
                (r) => {
                    console.error(
                        `Failure getting test cases from exercise ${exerciseId}: ${r}`,
                    );
                    return new Err(404, "Exercise does not exist");
                },
            );

        if (testCases instanceof Err) return testCases;

        const data: Test = {
            code: solution,
            language: testCases.programming_language,
            test_cases: testCases.test_case.map((tc) => {
                const { test_case_id, code } = tc;
                return { test_case_id, code };
            }),
        };
        const result = await executeTest(data);

        if (result instanceof Err)
            //OK
            return result;

        if (result.length === 0) return;

        const fails = {
            count: result.length,
            failed_visible_tests: result, // TODO: Transform object maybe
        };
        return new Err(69, fails);

        // TODO: object to return should be total num of errors, and outputs from the failed
    };
}

type TestCase = {
    test_case_id: number;
    code: string;
};

type Test = {
    language: string;
    code: string;
    test_cases: TestCase[];
};

type FailReason = {
    test_case_id: number;
    reason: string;
};

async function executeTest(data: Test): Promise<Result<FailReason[], Err>> {
    return axios
        .post(config.server.test_runner, JSON.stringify(data), {
            timeout: 5000,
            validateStatus: (s) => [200, 202].includes(s),
            responseType: "json",
        })
        .then(
            (r) => {
                return [];
            },
            (r) => {
                console.log("bad");
                console.log(r);
                console.log(r.data);
                //TODO: Validate correct format, else return Err (Compile error, language not supported, other errors)
                return r.data.toJSON();
            },
        );
}
