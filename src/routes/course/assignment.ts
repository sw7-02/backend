import Router, { Request, Response } from "express";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", (req: Request, res: Response) => {
    res.send("You just retrieved all assignments within the specific session");
    return res.sendStatus(200);
});

routes.get("/:assignment_id", (req: Request, res: Response) => {
    res.send("This is a specific assignment");
    return res.sendStatus(200);
});

// submit assignment solution
routes.post("/:assignment_id", (req: Request, res: Response) => {
    res.send("You have submitted your assignment solution");
    return res.sendStatus(201);
});

//TODO: Role middleware
routes.get(
    "/:assignment_id/assignment-solutions",
    (req: Request, res: Response) => {
        res.send("This is assignment solutions");
        return res.sendStatus(200);
    },
);

export default routes;
