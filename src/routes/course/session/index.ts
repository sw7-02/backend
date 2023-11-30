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
    ).post(async (req: Request, res: Response) => {
    const exerciseId: number = +res.locals.exerciseId;
    const userId: number = res.locals.jwtPayload.userId;
    const courseId = res.locals.courseId;
    const { solution, is_anonymous } = req.body;

    const testResult = await ExerciseController.testExercise(
        exerciseId,
        solution,
    );
    if (testResult instanceof Err) {
        const { code, msg } = testResult;
        res.status(code).send(msg);
        return;
    }

    let points;
    const resultSubmission = await CourseController.updatePoints(
        courseId,
        userId,
        exerciseId,
    ).then((result) => {
        if (!(result instanceof Err)) {
            points = result;
            return ExerciseController.submitExerciseSolution(
                exerciseId,
                userId,
                solution,
                is_anonymous,
            );
        } else return result;
    });

    if (resultSubmission instanceof Err) {
        if (points)
            // It found points, but failed in submitting => subtract the points
            await CourseController.decrementPoints(
                courseId,
                userId,
                points,
            );
        const { code, msg } = resultSubmission;
        res.status(code).send(msg);
    } else res.send(resultSubmission);
});

export default routes;
