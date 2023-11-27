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
    });

routes.get(
    "/:course_id/leaderboard",
    [enrollmentCheck],
    genericCourseIdHandler(CourseController.retrieveLeaderboard),
);

routes
    .use(enrollmentCheck)
    .route("/:course_id")
    .get(genericCourseIdHandler(CourseController.retrieveCourse))
    .put([roleCheck([Role.TEACHER])], (req: Request, res: Response) => {
        res.send("You have just updated a course (Unimplemented)");
    })
    .post([roleCheck([Role.TEACHER])], (req: Request, res: Response) => {
        res.send("You have just created a new session (Unimplemented)");
    })
    .delete([roleCheck([Role.TEACHER])], (req: Request, res: Response) => {
        res.send("You have just updated a course (Unimplemented)");
    });

export default routes;
