import Router, { NextFunction, Request, Response } from "express";
import exercise from "./exercise";

const routes = Router();

const sessionIDSave = (req: Request, res: Response, next: NextFunction) => {
    const id = +req.params.session_id;

    if (!id) {
        res.status(400).send("Session ID not a number");
        return;
    }
    res.locals.sessionId = id;
    next();
};

// enables passing json bodies.
routes.use(Router.json());
routes.use("/:session_id/exercise", sessionIDSave, exercise);
//routes.use("/:session_id/exercise", exercise);

routes.get("/", (req: Request, res: Response) => {
    res.send("This is the session overview (Unimplemented)");
});

routes
    .route("/:session_id")
    .get((req: Request, res: Response) => {
        res.send("This is the a specific session (Unimplemented)");
    })
    .put((req: Request, res: Response) => {
        res.send("You have just updated a session (Unimplemented)");
    })
    .delete((req: Request, res: Response) => {
        res.send("You have just deleted a session (Unimplemented)");
    });

export default routes;
