import Router, { NextFunction, Request, Response } from "express";
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
        //TODO: Adding hints and/or test cases? Only create and then use '/edit'?
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
        if (!title) {
            res.status(400).send("Title not provided provided");
            return;
        }
        const result = await ExerciseController.addExercise(
            res.locals.sessionId,
            title,
            description,
            points,
            programming_language,
            code_template,
            hints,
            test_cases,
            examples,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    });

routes
    .route("/:exercise_id") //TODO: Endpoint role check (full if teacher/TA, limited else)
    .all(saveExerciseId)
    .get(async (req: Request, res: Response) => {
        const id: number = +res.locals.exerciseId;
        const result = await ExerciseController.retrieveExerciseFull(id);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .patch([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const id: number = +res.locals.exerciseId;
        const result = await ExerciseController.patchExercise(id, req.body);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .put(async (req: Request, res: Response) => {
        const {
            hints,
            test_cases,
            examples,
            description,
            title,
            points,
            code_template,
            programming_language,
        } = req.body;
        if (
            !(
                hints &&
                test_cases &&
                examples &&
                description &&
                title &&
                points &&
                code_template &&
                programming_language
            )
        ) {
            res.status(400).send("Not all needed parameters provided");
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
    );

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

// edit for exercises
routes
    .route(":exercise_id/edit")
    .all([saveExerciseId, roleCheck([Role.TEACHER, Role.TA])])
    .get(async (req, res) => {})
    .patch(async (req, res) => {
        const {
            hints,
            test_cases,
            examples,
            description,
            title,
            points,
            programming_language,
        } = req.body;
    });
//TODO: Mod exercise (CRUD) hints + test cases + examples (edit-endpoint)

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
