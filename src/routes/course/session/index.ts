import Router, { Request, Response } from "express";
import exercise from "./exercise";
import { Err, Role } from "../../../lib";
import roleCheck from "../../../middlewares/roleCheck";
import CourseController from "../../../controllers/CourseController";
import { saveSessionId } from "../../../middlewares/savings";
import SessionController from "../../../controllers/SessionController";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());
routes.use("/:session_id/exercise", saveSessionId, exercise);

routes
    .route("/")
    .get(async (req: Request, res: Response) => {
        const result = await CourseController.retrieveCourse(
            res.locals.courseId,
        );
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result.sessions);
    })
    .post([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const { title } = req.body;
        if (!title) {
            res.status(400).send("Bad request body");
            return;
        }
        const result = await SessionController.insertSessionFromCourse(
            res.locals.courseId,
            title.trim(),
        );
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    });

routes
    .route("/:session_id")
    .all(saveSessionId)
    .get(async (req: Request, res: Response) => {
        const result = await SessionController.retrieveSessionFromCourse(
            res.locals.sessionId,
        );
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    })
    .delete(
        [roleCheck([Role.TEACHER])],
        async (req: Request, res: Response) => {
            const result = await SessionController.deleteSessionFromCourse(
                res.locals.sessionId,
            );
            if (result instanceof Err) {
                res.status(result.code).send(result.msg);
            } else res.send(result);
        },
    )
    .put([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const { title } = req.body;
        if (!title) {
            res.status(400).send("Bad request body");
            return;
        }
        const result = await SessionController.renameSessionFromCourse(
            res.locals.sessionId,
            title.trim(),
        );
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    });

export default routes;
