import Router, {Request, Response} from "express";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", (req: Request, res: Response) => {
    res.send("This is a specific exercise (editor)");
    return res.sendStatus(200);
});

// submit exercise solution
routes.put("/", (req: Request, res: Response) => {
    // TODO: Put solution to exercise_solution table
    res.send("You have submitted your exercise solution");
    return res.sendStatus(201);
});

// exercise solutions
routes.get("/exercise-solutions", (req: Request, res: Response) => {
    res.send("This is the exercise solutions for a specific exercise");
    return res.sendStatus(201);
});

export default routes;