import Router, { Request, Response } from "express";
import ExerciseController from "../../../controllers/ExerciseController";
import { Err } from "../../../lib";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

//TODO: Adding hints and/or test cases?

routes.get("/", (req: Request, res: Response) => {
    res.send("You just retrieved all exercises within the specific session");
    return res.sendStatus(201);
});

//TODO: Role middleware
routes.post("/", async (req: Request, res: Response) => {
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
    if (Number.isNaN(id)) {
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
routes.delete("/:exercise_id", (req: Request, res: Response) => {
    res.send("You deleted a exercise to a specific course");
    return res.sendStatus(201);
});

// submit exercise solution
routes.post("/:exercise_id", async (req: Request, res: Response) => {
    const exerciseId: number = +req.params.exercise_id;
    if (Number.isNaN(exerciseId)) {
        res.status(400).send("ID not a number");
        return;
    }
    const userId: number = res.locals.jwtPayload.userId;
    const { solution, is_anonymous } = req.body;

    const result = await ExerciseController.submitExerciseSolution(
        exerciseId,
        userId,
        solution,
    );
    if (result instanceof Err) {
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
routes.get("exercise_id/exercise-solutions", (req: Request, res: Response) => {
    res.send("This is the exercise solutions for a specific exercise");
    return res.sendStatus(201);
});

export default routes;
