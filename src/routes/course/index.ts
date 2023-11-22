import Router, { Request, Response } from "express";
import session from "./session";
import assignment from "./assignment";
import { validateJWT } from "../../middlewares/validateJWT";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

// TODO: Uncomment when ready
//routes.use(validateJWT); // Uses the middleware on ALL routes
routes.use("/:course_id/assignment", assignment);
routes.use("/:course_id/session", session);
//routes.use("/:course_id/assignment", [ENROLLMENT], assignment);
//routes.use("/:course_id/session", [ENROLLMENT], session);

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

//TODO: Enrollment check middleware
routes.get("/:course_id", (req: Request, res: Response) => {
    res.send("This is a specific course");
    return res.sendStatus(201);
});

//TODO: Role middleware
routes.put("/:course_id", (req: Request, res: Response) => {
    res.send("You have just updated a course");
    return res.sendStatus(201);
});

//TODO: Enrollment + Role middleware
routes.delete("/:course_id", (req: Request, res: Response) => {
    res.send("You have just updated a course");
    return res.sendStatus(201);
});

//TODO: Enrollment + Role middleware
routes.post("/:course_id", (req: Request, res: Response) => {
    res.send("You have just created a new session");
    return res.sendStatus(201);
});

// leaderboards
//TODO: Enrollment check middleware
routes.get("/:course_id/leaderboard", (req: Request, res: Response) => {
    res.send("This is the leaderboard");
    return res.sendStatus(201);
});

export default routes;
