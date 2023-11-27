import Router, { NextFunction, Request, Response } from "express";
import exercise from "./exercise";
import { Err, Result, Role } from "../../../lib";
import roleCheck from "../../../middlewares/roleCheck";

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

const genericCourseIdHandler =
    (func: (courseId: number) => Promise<Result<Object>>) =>
        async (req: Request, res: Response) => {
            const courseId = +res.locals.courseId;
            const result = await func(courseId);
            if (result instanceof Err) {
                const { code, msg } = result;
                res.status(code).send(msg);
            } else res.send(result);
        };

routes.get("/", (req: Request, res: Response) => {
    res.send("This is the session overview (Unimplemented)");
});

routes
    .route("/:session_id")
    .get((req: Request, res: Response) => {
        res.send("This is the a specific session (Unimplemented)");
    })
    .put([roleCheck([Role.TEACHER])], (req: Request, res: Response) => {
        res.send("You have just updated a session (Unimplemented)");
    })
    .delete([roleCheck([Role.TEACHER])], (req: Request, res: Response) => {
        res.send("You have just deleted a session (Unimplemented)");
    });

export default routes;
