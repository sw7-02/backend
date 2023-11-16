import Router, { Request, Response } from "express";
import session from "./session";
import assignment from "./assignment";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.use("/:course_id/assignment", assignment);
routes.use("/:course_id/session", session);

// This file is intended for both accessing all courses and a specific one
routes
    .route("/")
    .get((req: Request, res: Response) => {
        res.send("This is the course overview");
        return res.sendStatus(201);
    })
    .post((req: Request, res: Response) => {
        res.send("You added a new course");
        return res.sendStatus(201);
    });

routes.get("/:course_id", (req: Request, res: Response) => {
    res.send("This is a specific course");
    return res.sendStatus(201);
});

routes.put("/:course_id", (req: Request, res: Response) => {
    res.send("You have just updated a course");
    return res.sendStatus(201);
});

routes.delete("/:course_id", (req: Request, res: Response) => {
    res.send("You have just updated a course");
    return res.sendStatus(201);
});

routes.post("/:course_id", (req: Request, res: Response) => {
    res.send("You have just created a new session");
    return res.sendStatus(201);
});

// leaderboards
routes.get("/:course_id/leaderboard", (req: Request, res: Response) => {
    res.send("This is the leaderboard");
    return res.sendStatus(201);
});

export default routes;
