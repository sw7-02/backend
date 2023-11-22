import Router, { NextFunction, Request, Response } from "express";
import exercise from "./exercise";

const routes = Router();

const sessionIDSave = (req: Request,
                     res: Response,
                     next: NextFunction) => {
    const id = +req.params.session_id

    if (!id) {
        res.status(400).send("Session ID not a number");
        return;
    }
    res.locals.sessionId = id;
    next();
}

// enables passing json bodies.
routes.use(Router.json());
routes.use("/:session_id/exercise", sessionIDSave, exercise);
//routes.use("/:session_id/exercise", exercise);


routes.get("/", (req: Request, res: Response) => {
    res.send("This is the session overview");
    return res.sendStatus(201);
});

routes.get("/:session_id", (req: Request, res: Response) => {
    res.send("This is the a specific session");
});

routes.put("/:session_id", (req: Request, res: Response) => {
    res.send("You have just updated a session");
    return res.sendStatus(201);
});

routes.delete("/:session_id", (req: Request, res: Response) => {
    res.send("You have just deleted a session");
    return res.sendStatus(201);
});

export default routes;
