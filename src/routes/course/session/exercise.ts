import Router, { Request, Response } from "express";
import ExerciseController from "../../../controllers/ExerciseController";
import { Err } from "../../../lib";

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
    } else res.send(result);
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

    // TODO: test the solution beforehand

    const userId: number = res.locals.jwtPayload.userId;
    const courseId = res.locals.courseId;
    const { solution, is_anonymous } = req.body;

    //TODO: Give points - CourseController

    const resultSubmission = await ExerciseController.submitExerciseSolution(
        exerciseId,
        userId,
        solution,
        is_anonymous,
    );
    if (resultSubmission instanceof Err) {
        const { code, msg } = resultSubmission;
        res.status(code).send(msg);
    } else res.send(resultSubmission);
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
