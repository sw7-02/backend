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
                (res) => {
                    console.error(res.solutions);
                    const out = res.solutions.map((r) => {
                        const { solution, is_pinned } = r;
                        const username = r.is_anonymous
                            ? "Anonymous"
                            : r.user.username;
                        return {
                            solution,
                            is_pinned,
                            username,
                        };
                    });
                    console.error(out);
                    return out;
                },
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
        title = title?.trim();
        programmingLanguage = programmingLanguage?.trim();
        if (!title) return new Err(406, "No title supplied");
        if (programmingLanguage !== undefined && !programmingLanguage)
            return new Err(406, "No programming language supplied");
        return prisma.exercise
            .create({
                data: {
                    session: {
                        connect: {
                            session_id: sessionId,
                        },
                    },
                    title: title,
                    description: description?.trim() ?? "",
                    points: points ?? 0,
                    programming_language: programmingLanguage ?? "Language",
                    code_template: codeTemplate?.trim() ?? "",
                    hints: {
                        createMany: {
                            data:
                                hints?.map((h) => {
                                    return {
                                        description: h.trim(),
                                        order: order++,
                                    };
                                }) ?? [],
                        },
                    },
                    test_case: {
                        createMany: {
                            data:
                                testCases?.map((c) => {
                                    return { code: c.trim() };
                                }) ?? [],
                        },
                    },
                    examples: {
                        createMany: {
                            data:
                                examples?.map(({ input, output }) => {
                                    return {
                                        input: input.trim(),
                                        output: output.trim(),
                                    };
                                }) ?? [],
                        },
                    },
                },
                select: {
                    exercise_id: true,
                },
            })
            .catch((r) => {
                console.error(`Failure trying to add exercise: ${r}`);
                return new Err(404, "Session does not exist");
            });
    };

    static deleteExercise = async (exerciseId: number): Promise<Result<void>> =>
        await prisma
            .$transaction(await this.deleteExerciseTransactions(exerciseId))
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

    static deleteExerciseTransactions = async (exerciseId: number) => {
        const cond = {
            where: {
                exercise_id: exerciseId,
            },
        };
        const c = prisma.exercise.delete(cond);
        const e1 = prisma.hint.deleteMany(cond);
        const e2 = prisma.example.deleteMany(cond);
        const e3 = prisma.testCase.deleteMany(cond);
        let solutions = prisma.exerciseSolution.findMany(cond);

        return [solutions, e1, e2, e3, c];
    };

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
        title = title?.trim();
        programmingLanguage = programmingLanguage?.trim();
        if (title !== undefined && !title)
            return new Err(406, "No title supplied");
        if (programmingLanguage !== undefined && !programmingLanguage)
            return new Err(406, "No programming language supplied");

        let hintOrder = 0;
        let additional = { hints: {}, test_case: {}, examples: {} };
        if (hints)
            additional.hints = {
                deleteMany: {
                    // removes additional, if any
                    exercise_id: exerciseId,
                },
                createMany: {
                    // Creates new if needed
                    data: hints.slice(hintOrder).map((h) => {
                        return {
                            description: h.trim(),
                            order: ++hintOrder,
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
                        return { code: c.trim() };
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
                    data: examples.map((io) => {
                        return {
                            input: io.input.trim(),
                            output: io.output.trim(),
                        };
                    }),
                },
            };

        return prisma.exercise
            .update({
                where: {
                    exercise_id: exerciseId,
                },
                data: {
                    title: title,
                    description: description?.trim(),
                    programming_language: programmingLanguage,
                    code_template: codeTemplate?.trim(),
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
        userId: number,
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
            .catch((r) => {
                console.error(
                    `Failure getting test cases from exercise ${exerciseId}: ${r}`,
                );
                return new Err(404, "Exercise does not exist");
            });

        if (testCases instanceof Err) return testCases;

        const data: ExerciseTest = {
            code: solution.trim(),
            language: testCases.programming_language,
            testCases: testCases.test_case.map((tc) => {
                const { test_case_id, code } = tc;
                return { testCaseId: test_case_id, code };
            }),
            userId,
        };
        const result = await executeTest(data);

        if (result instanceof Err) return result;
        else if (result.length === 0) return;

        const fails = {
            count: result.length,
            failed_tests: result,
        };
        return new Err(400, fails);
    };
}

type TestCase = {
    testCaseId: number;
    code: string;
};

type ExerciseTest = {
    language: string;
    code: string;
    userId: number;
    testCases: TestCase[];
};

type TestResponse = {
    testCaseId: number;
    reason: string;
    responseCode: ResponseCode;
};

enum ResponseCode {
    UNKNOWN_FAILURE_CODE = 4,
    TIMEOUT_CODE = 3,
    COMPILATION_ERROR_CODE = 2,
    TEST_FAILED_CODE = 1,
    TEST_PASSED_CODE = 0,
}

function parseTestResponse(objs: any[]): TestResponse[] | undefined {
    if (objs === undefined) return;
    let out: TestResponse[] = [];
    for (const o of objs) {
        if (o === undefined) return;
        const { testCaseId, reason, responseCode } = o;
        const rc = responseCode as ResponseCode;
        if (
            testCaseId === undefined ||
            reason === undefined ||
            rc === undefined
        )
            return;
        else out.push({ testCaseId, reason, responseCode: rc });
    }
    return out;
}

async function executeTest(data: ExerciseTest): Promise<Result<string[]>> {
    return axios
        .post(config.server.test_runner, data, {
            timeout: 10000,
            //validateStatus: (s) => [200, 202].includes(s),
            //responseType: "json",
        })
        .then(
            (response) => {
                const testsResponses = parseTestResponse(response.data);

                if (testsResponses === undefined)
                    return new Err(500, "Internal fuckup");

                let failures: string[] = [];
                for (const t of testsResponses) {
                    const { testCaseId, reason, responseCode } = t;
                    if (
                        testCaseId === undefined ||
                        reason === undefined ||
                        responseCode === undefined
                    )
                        return new Err(
                            500,
                            "Internal error: Test runner response missing",
                        );
                    switch (responseCode) {
                        case ResponseCode.TEST_PASSED_CODE:
                            continue;
                        case ResponseCode.TEST_FAILED_CODE:
                            failures.push(reason);
                            continue;
                        default:
                            return new Err(
                                500,
                                "Internal error: Test runner returned unexpected",
                            );
                    }
                }
                return failures;
            }, // If good, test can have failed
            (error) => {
                const testResponse = parseTestResponse(error.response.data);
                if (testResponse === undefined)
                    return new Err(500, `Bad request: ${error.response.data}`);
                if (testResponse.length !== 1)
                    return new Err(
                        500,
                        "Internal Error: Test runner returned multiple results when a single was expected",
                    );
                const { testCaseId, reason, responseCode } = testResponse[0];
                switch (responseCode) {
                    case ResponseCode.COMPILATION_ERROR_CODE:
                        return new Err(400, {
                            msg: "Compilation error",
                            description: reason,
                        });
                    case ResponseCode.TIMEOUT_CODE:
                        return new Err(400, "Code timed out");
                    case ResponseCode.UNKNOWN_FAILURE_CODE:
                        return new Err(
                            500,
                            "Internal error: Test runner returned unknown error",
                        );
                    case ResponseCode.TEST_FAILED_CODE:
                    case ResponseCode.TEST_PASSED_CODE:
                        return new Err(
                            500,
                            "Internal error: Test runner returned unexpected output",
                        );
                    default:
                        return new Err(
                            500,
                            "Internal error: Test runner returned unknown response code",
                        );
                }
            },
        );
}
