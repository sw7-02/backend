import Router, { NextFunction, Request, Response } from "express";
import exercise from "./exercise";
import { Err, Result, Role } from "../../../lib";
import roleCheck from "../../../middlewares/roleCheck";
import CourseController from "../../../controllers/CourseController";

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

routes.get("/", (req: Request, res: Response) => {
    res.send("This is the session overview (Unimplemented)");
});

routes.use(sessionIDSave)
    .route("/:session_id")
    .get(async (req: Request, res: Response) => {
        const result = await CourseController.retrieveSessionFromCourse(res.locals.sessionId);
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    })
    .put([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const {title} = req.body;
        if (!title) {
            res.status(400).send("Bad request body");
            return;
        }
        const result = await CourseController.insertSessionFromCourse(res.locals.courseId, title);
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    })
    .delete([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const result = await CourseController.deleteSessionFromCourse(res.locals.sessionId);
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    });

export default routes;
