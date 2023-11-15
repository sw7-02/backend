import Router, {Request, Response} from "express";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", (req: Request, res: Response) => {
    res.send("You just retrieved all exercises within the specific session");
    return res.sendStatus(201);
});

routes.post("/", (req: Request, res: Response) => {
    res.send("You added a new exercise to a specific course");
    return res.sendStatus(201);
});

routes.get("/:exercise_id", (req: Request, res: Response) => {
    res.send("This is a specific exercise (editor)");
    return res.sendStatus(200);
});

routes.delete("/", (req: Request, res: Response) => {
    res.send("You deleted a exercise to a specific course");
    return res.sendStatus(201);
});

// submit exercise solution
routes.put("/:exercise_id", (req: Request, res: Response) => {
    // TODO: Put solution to exercise_solution table
    res.send("You have submitted your exercise solution");
    return res.sendStatus(201);
});

// exercise solutions
routes.get("exercise_id/exercise-solutions", (req: Request, res: Response) => {
    res.send("This is the exercise solutions for a specific exercise");
    return res.sendStatus(201);
});

export default routes;