import Router, { Request, Response } from "express";
import ExerciseController from "../../../controllers/ExerciseController";
import { Err, Role } from "../../../lib";
import CourseController from "../../../controllers/CourseController";
import roleCheck from "../../../middlewares/roleCheck";
import enrollmentCheck from "../../../middlewares/enrollmentCheck";
import prisma from "../../../prisma";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", async (req: Request, res: Response) => {
    const result = await ExerciseController.retrieveAllExercises(
        res.locals.sessionId,
    );
    if (result instanceof Err) {
        const { code, msg } = result;
        res.status(code).send(msg);
    } else res.send(result);
});

routes.post(
    "/",
    [roleCheck([Role.TEACHER])],
    async (req: Request, res: Response) => {
        //TODO: Adding hints and/or test cases?
        const {
            title,
            description,
            points,
            programming_language,
            code_template,
            hints,
        } = req.body;
        if (
            !(
                title &&
                description &&
                points &&
                programming_language &&
                code_template
            )
        ) {
            res.status(400).send("Not all necessary parameters was provided");
        }
        const result = await ExerciseController.addExercise(
            res.locals.sessionId,
            title,
            description,
            points,
            programming_language,
            code_template,
            hints,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    },
);

routes
    .route("/:exercise_id")
    .get(async (req: Request, res: Response) => {
        const id: number = +req.params.exercise_id;
        if (!id) {
            res.status(400).send("ID not a number");
            return;
        }
        const result = await ExerciseController.retrieveExercise(id);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .delete(
        [roleCheck([Role.TEACHER])],
        async (req: Request, res: Response) => {
            const id: number = +req.params.exercise_id;
            if (!id) {
                res.status(400).send("ID not a number");
                return;
            }
            const result = await ExerciseController.deleteExercise(id);
            if (result instanceof Err) {
                const { code, msg } = result;
                res.status(code).send(msg);
            } else res.send();
        },
    )
    .post(async (req: Request, res: Response) => {
        const exerciseId: number = +req.params.exercise_id;
        if (!exerciseId) {
            res.status(400).send("ID not a number");
            return;
        }

        // TODO: test the solution beforehand

        const userId: number = res.locals.jwtPayload.userId;
        const courseId = res.locals.courseId;
        const { solution, is_anonymous } = req.body;

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

routes.post("/:exercise_id/test", (req: Request, res: Response) => {
    // TODO: TEST CODE
    res.send("Tested code (Unimplemented)");
});

// exercise solutions
routes.get(
    ":exercise_id/exercise-solutions",
    async (req: Request, res: Response) => {
        const exerciseId: number = +req.params.exercise_id;
        if (!exerciseId) {
            res.status(400).send("ID not a number");
            return;
        }

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
