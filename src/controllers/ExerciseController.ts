import prisma from "../prisma";
import { Err, ResponseResult, Result } from "../lib";
import axios from "axios";
import config from "../config";

type _Exercise = {
    exercise_id: number;
    title: string;
    description: string;
    code_template: string;
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
    ): Promise<ResponseResult<_Exercise[]>> =>
        prisma.exercise
            .findMany({
                where: {
                    session_id: sessionId,
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
                (res) =>
                    res.map((r) => {
                        const {
                            exercise_id,
                            title,
                            description,
                            hints,
                            code_template,
                            points,
                            test_case,
                        } = r;
                        return {
                            exercise_id,
                            title,
                            description,
                            code_template,
                            points,
                            hints: hints.map((h) => h.description),
                            test_case: test_case.map((t) => t.code),
                        };
                    }),
                (r) => {
                    console.error(`Failure getting session ${sessionId}: ${r}`);
                    return new Err(404, "Session does not exist");
                },
            );

    static retrieveExercise = async (
        exerciseId: number,
    ): Promise<ResponseResult<_Exercise>> =>
        prisma.exercise
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
        isAnon: boolean = false,
    ): Promise<ResponseResult<void>> =>
        prisma.exerciseSolution
            .upsert({
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
    ): Promise<ResponseResult<_ExerciseSolution[]>> =>
        prisma.exerciseSolution
            .findMany({
                where: {
                    exercise_id: exerciseId,
                },
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
                orderBy: {
                    is_pinned: "asc",
                },
            })
            .then(
                (res) =>
                    res.map((r) => {
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
    ): Promise<ResponseResult<number>> => {
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

    static deleteExercise = async (
        exerciseId: number,
    ): Promise<ResponseResult<void>> =>
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

    static testExercise = async (
        exerciseId: number,
        solution: string,
    ): Promise<ResponseResult<void>> => {
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
                            is_visible: true,
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
            failed_visible_tests: result.filter(
                (r) =>
                    testCases.test_case.find(
                        (v) => v.test_case_id == r.test_case_id,
                    )?.is_visible,
            ),
        };
        return new Err(69, fails);

        // TODO: object to return should be total num of errors, and the ID's for the visible ones
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
