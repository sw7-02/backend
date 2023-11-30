import Router, { Request, Response } from "express";
import ExerciseController from "../../../controllers/ExerciseController";
import { Err, Role } from "../../../lib";
import CourseController from "../../../controllers/CourseController";
import roleCheck from "../../../middlewares/roleCheck";
import prisma from "../../../prisma";
import { saveExerciseId } from "../../../middlewares/savings";

// TODO: (FW) get-hint endpoint and decrement potential point-gain for specific exercise

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes
    .route("/")
    .get(async (req: Request, res: Response) => {
        const result = await ExerciseController.retrieveAllExercises(
            res.locals.sessionId,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .post([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const {
            title,
            description,
            points,
            programming_language,
            code_template,
            test_cases,
            examples,
            hints,
        } = req.body;
        if (!req.body.title) {
            res.status(400).send("Title not provided provided");
            return;
        }
        const result = await ExerciseController.addExercise(
            res.locals.sessionId,
            {
                title,
                description,
                points,
                programmingLanguage: programming_language,
                codeTemplate: code_template,
                hints,
                testCases: test_cases,
                examples,
            },
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.status(200).send({ exercise_id: result });
    });

routes
    .route("/:exercise_id")
    .all(saveExerciseId)
    .get(async (req: Request, res: Response) => {
        const id: number = +res.locals.exerciseId;
        if ([Role.TEACHER, Role.TA].includes(res.locals.userRole)) {
            const result = await ExerciseController.retrieveExerciseFull(id);
            if (result instanceof Err) {
                const { code, msg } = result;
                res.status(code).send(msg);
            } else res.send(result);
        } else {
            // Student
            const result = await ExerciseController.retrieveExercise(id);
            if (result instanceof Err) {
                const { code, msg } = result;
                res.status(code).send(msg);
            } else res.send(result);
        }
    })
    .patch([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const id: number = +res.locals.exerciseId;
        const result = await ExerciseController.patchExercise(id, req.body);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .put([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const missing = [
            { val: req.body.hints, name: "hints" },
            { val: req.body.test_cases, name: "test cases" },
            { val: req.body.examples, name: "examples" },
            { val: req.body.description, name: "description" },
            { val: req.body.title, name: "title" },
            { val: req.body.points, name: "points" },
            { val: req.body.code_template, name: "code template" },
            { val: req.body.programming_language, name: "programming language" },
        ]
            .filter((c) => c.val === undefined)
            .map((c) => c.name);
        if (missing.length > 0) {
            res.status(400).send(
                `Not all needed parameters provided: Missing ${missing}`,
            );
            return;
        }
        const id: number = +res.locals.exerciseId;
        const result = await ExerciseController.patchExercise(id, req.body);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .delete(
        [roleCheck([Role.TEACHER])],
        async (req: Request, res: Response) => {
            const id: number = +res.locals.exerciseId;
            const result = await ExerciseController.deleteExercise(id);
            if (result instanceof Err) {
                const { code, msg } = result;
                res.status(code).send(msg);
            } else res.send();
        },
    )
    .post(async (req: Request, res: Response) => {
        const exerciseId: number = +res.locals.exerciseId;
        const userId: number = res.locals.jwtPayload.userId;
        const courseId = res.locals.courseId;
        const { solution, is_anonymous } = req.body;

        const testResult = await ExerciseController.testExercise(
            exerciseId,
            solution,
        );
        if (testResult instanceof Err) {
            const { code, msg } = testResult;
            res.status(code).send(msg);
            return;
        }

        let points;
        const resultSubmission = await CourseController.updatePoints(
            courseId,
            userId,
            exerciseId,
        ).then((result) => {
            if (!(result instanceof Err)) {
                points = result;
                return ExerciseController.submitExerciseSolution(
                    exerciseId,
                    userId,
                    solution,
                    is_anonymous,
                );
            } else return result;
        });

        if (resultSubmission instanceof Err) {
            if (points)
                // It found points, but failed in submitting => subtract the points
                await CourseController.decrementPoints(
                    courseId,
                    userId,
                    points,
                );
            const { code, msg } = resultSubmission;
            res.status(code).send(msg);
        } else res.send(resultSubmission);
    });

routes.post("/:exercise_id/test", async (req: Request, res: Response) => {
    const id: number = +res.locals.exerciseId;
    const { solution } = req.body;
    if (!solution) {
        res.status(400).send("No solution provided");
        return;
    }

    const result = await ExerciseController.testExercise(id, solution);
    if (result instanceof Err) {
        const { code, msg } = result;
        res.status(code).send(msg);
    } else res.send(result);
});

// exercise solutions
routes.get(
    ":exercise_id/exercise-solutions",
    saveExerciseId,
    async (req: Request, res: Response) => {
        const exerciseId: number = +res.locals.exerciseId;

        const userId = res.locals.jwtPayload.userId;

        const role = await prisma.enrollment
            .findUnique({
                where: {
                    user_id_course_id: {
                        user_id: userId,
                        course_id: res.locals.courseId,
                    },
                },
                select: {
                    user_role: true,
                },
            })
            .then((r) => r?.user_role);
        if (!role) {
            res.status(500).send("Internal error");
            return;
        }

        if (![Role.TEACHER, Role.TA].includes(role)) {
            const hasSubmitted = await prisma.exerciseSolution
                .findFirst({
                    where: {
                        exercise_id: exerciseId,
                        user_id: userId,
                    },
                })
                .then((r) => true);

            if (!hasSubmitted) {
                res.status(403).send(
                    "You need to submit an exercise yourself before you can see the others",
                );
                return;
            }
        }

        const result =
            await ExerciseController.retrieveAllExerciseSolutions(exerciseId);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    },
);

export default routes;
