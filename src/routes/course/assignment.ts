import Router, { NextFunction, Request, Response } from "express";
import ExerciseController from "../../controllers/ExerciseController";
import { Err, Role } from "../../lib";
import AssignmentController from "../../controllers/AssignmentController";
import roleCheck from "../../middlewares/roleCheck";
import { saveAssignmentId } from "../../middlewares/savings";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", async (req: Request, res: Response) => {
    const result = await AssignmentController.retrieveAllAssignments(
        res.locals.courseId,
    );
    if (result instanceof Err) {
        const { code, msg } = result;
        res.status(code).send(msg);
    } else res.send(result);
});

routes
    .route("/:assignment_id")
    .all(saveAssignmentId)
    .get(async (req: Request, res: Response) => {
        const id: number = +res.locals.assignmentId;
        const result = await AssignmentController.retrieveAssignment(id);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .post(async (req: Request, res: Response) => {
        // submit assignment solution
        const id: number = +res.locals.assignmentId;
        const userId: number = res.locals.jwtPayload.userId;
        const { solution } = req.body;

        const result = await AssignmentController.submitAssignmentSolution(
            id,
            userId,
            solution,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .put([roleCheck([Role.TEACHER])], async (req: Request, res: Response) => {
        //TODO: Add assignment
    });

routes.get(
    "/:assignment_id/assignment-solution/",
    [roleCheck([Role.TEACHER, Role.TA]), saveAssignmentId],
    async (req: Request, res: Response) => {
        //const id: number = +res.locals.assignmentId
        const result =
            await AssignmentController.retrieveAllAssignmentSolutions(
                res.locals.courseId,
            );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    },
);
routes
    .route("/:assignment_id/assignment-solution/feedback")
    .all(saveAssignmentId)
    .get(async (req: Request, res: Response) => {
        const id: number = +res.locals.assignmentId;
        const result = await AssignmentController.retrieveAssignmentFeedback(
            id,
            res.locals.jwtPayload.userId,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .post(
        [roleCheck([Role.TEACHER, Role.TA])],
        async (req: Request, res: Response) => {
            const solId: number = +req.body.assignment_solution_id;
            if (!solId) {
                res.status(400).send("Assignment solution ID not a number");
                return;
            }
            const feedback: string = req.body.feedback;
            const result = await AssignmentController.postAssignmentFeedback(
                solId,
                feedback,
            );
            if (result instanceof Err) {
                const { code, msg } = result;
                res.status(code).send(msg);
            } else res.send(result);
        },
    );

export default routes;
