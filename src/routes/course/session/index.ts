import Router, { Request, Response } from "express";
import exercise from "./exercise";
import { Err, Role } from "../../../lib";
import roleCheck from "../../../middlewares/roleCheck";
import CourseController from "../../../controllers/CourseController";
import { saveSessionId } from "../../../middlewares/savings";
import ExerciseController from "../../../controllers/ExerciseController";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());
routes.use("/:session_id/exercise", saveSessionId, exercise);

routes.get("/", async (req: Request, res: Response) => {
    const result = await CourseController.retrieveCourse(res.locals.courseId);
    if (result instanceof Err) {
        res.status(result.code).send(result.msg);
    } else res.send(result.sessions);
});

routes
    .route("/:session_id")
    .all(saveSessionId)
    .get(async (req: Request, res: Response) => {
        const result = await CourseController.retrieveSessionFromCourse(
            res.locals.sessionId,
        );
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    })
    // TODO: Remove put and place above
    .put([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        const { title } = req.body;
        if (!title) {
            res.status(400).send("Bad request body");
            return;
        }
        const result = await CourseController.insertSessionFromCourse(
            res.locals.courseId,
            title,
        );
        if (result instanceof Err) {
            res.status(result.code).send(result.msg);
        } else res.send(result);
    })
    .delete(
        [roleCheck([Role.TEACHER])],
        async (req: Request, res: Response) => {
            const result = await CourseController.deleteSessionFromCourse(
                res.locals.sessionId,
            );
            if (result instanceof Err) {
                res.status(result.code).send(result.msg);
            } else res.send(result);
        },
    );

export default routes;
