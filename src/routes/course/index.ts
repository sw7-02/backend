import Router, { Request, Response } from "express";
import session from "./session";
import assignment from "./assignment";
import validateJWT from "../../middlewares/validateJWT";
import CourseController from "../../controllers/CourseController";
import { Err, Result, Role } from "../../lib";
import enrollmentCheck from "../../middlewares/enrollmentCheck";
import roleCheck from "../../middlewares/roleCheck";

const routes = Router()
    .use(Router.json())
    .use(validateJWT)
    .use("/:course_id/assignment", [enrollmentCheck], assignment)
    .use("/:course_id/session", [enrollmentCheck], session);

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

// This file is intended for both accessing all courses and a specific one
routes
    .route("/")
    .get(async (req: Request, res: Response) => {
        const userId = +res.locals.jwtPayload.userId;
        const result = await CourseController.retrieveEnrolledCourses(userId);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .post((req: Request, res: Response) => {
        // TODO: Is teacher check
        res.send("You added a new course (Unimplemented)");
    })
    .delete((req: Request, res: Response) => {
        res.send("You deleted a course (Unimplemented)");
    });

routes.get(
    "/:course_id/leaderboard",
    [enrollmentCheck],
    genericCourseIdHandler(CourseController.retrieveLeaderboard),
);

routes
    .route("/:course_id/leaderboard/anonymity")
    .get([enrollmentCheck], async (req: Request, res: Response) => {
        const userId = +res.locals.jwtPayload.userId;
        const courseId = +res.locals.jwtPayload.courseId;
        const result = await CourseController.getAnonymity(userId, courseId);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .post([enrollmentCheck], async (req: Request, res: Response) => {
        const userId = +res.locals.jwtPayload.userId;
        const courseId = +res.locals.jwtPayload.courseId;
        const { anonymity } = req.body;
        if (anonymity === undefined) {
            res.status(400).send("Body missing 'anonymity'");
            return;
        }
        const result = await CourseController.setAnonymity(
            userId,
            courseId,
            anonymity,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
        // TODO: test these
    });

routes
    .route("/:course_id")
    .all(enrollmentCheck)
    .get(genericCourseIdHandler(CourseController.retrieveFullCourse))
    .put([roleCheck([Role.TEACHER])], (req: Request, res: Response) => {
        res.send("You have just updated a course (Unimplemented)");
    });

export default routes;
