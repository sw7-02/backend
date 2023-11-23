import Router, { Request, Response } from "express";
import ExerciseController from "../../../controllers/ExerciseController";
import { Err } from "../../../lib";
import CourseController from "../../../controllers/CourseController";

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

//TODO: Role middleware
routes.post("/", async (req: Request, res: Response) => {
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
    } else res.status(201).send(result);
});

routes.get("/:exercise_id", async (req: Request, res: Response) => {
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
});

//TODO: Role middleware
routes.delete("/:exercise_id", async (req: Request, res: Response) => {
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
});

// submit exercise solution
routes.post("/:exercise_id", async (req: Request, res: Response) => {
    const exerciseId: number = +req.params.exercise_id;
    if (!exerciseId) {
        res.status(400).send("ID not a number");
        return;
    }
    const { solution, is_anonymous } = req.body;
//    const userId: number = res.locals.jwtPayload.userId;
    const userId: number = 1;
    const courseId = 1//res.locals.courseId;

    let result = await ExerciseController.testExercise(exerciseId, solution);
    if (result instanceof Err) {
        const { code, msg } = result;
        res.status(code).send(msg);
        return;
    }

    let points;
    result = await CourseController.updatePoints(
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

    if (result instanceof Err) {
        if (points)
            // It found points, but failed in submitting => subtract the points
            CourseController.decrementPoints(
                courseId,
                userId,
                exerciseId,
                points,
            );
        const { code, msg } = result;
        res.status(code).send(msg);
    } else res.send(result);
});

routes.put("/:exercise_id", (req: Request, res: Response) => {
    // TODO: We have the post?
    res.send("You have updated your exercise solution");
    return res.sendStatus(201);
});

// exercise solutions
// TODO: Role check middleware
routes.get(
    ":exercise_id/exercise-solutions",
    async (req: Request, res: Response) => {
        const exerciseId: number = +req.params.exercise_id;
        if (!exerciseId) {
            res.status(400).send("ID not a number");
            return;
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
