import Router, { Request, Response } from "express";
import ExerciseController from "../../controllers/ExerciseController";
import { Err } from "../../lib";
import AssignmentController from "../../controllers/AssignmentController";

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
    .get(async (req: Request, res: Response) => {
        const id: number = +req.params.assignment_id;
        if (!id) {
            res.status(400).send("ID not a number");
            return;
        }
        const result = await AssignmentController.retrieveAssignment(id);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    .post(async (req: Request, res: Response) => {
        // submit assignment solution
        const id: number = +req.params.assignment_id;
        if (!id) {
            res.status(400).send("ID not a number");
            return;
        }
        const userId: number = res.locals.jwtPayload.userId;
        const { solution } = req.body;

        // TODO: Test code (if assignments should be tested?)

        const result = await AssignmentController.submitAssignmentSolution(
            id,
            userId,
            solution,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    });

//TODO: Role middleware
routes.get(
    "/:assignment_id/assignment-solution/",
    async (req: Request, res: Response) => {
        const id: number = +req.params.assignment_id;
        if (!id) {
            res.status(400).send("ID not a number");
            return;
        }
        const result =
            await AssignmentController.retrieveAllAssignmentSolutions(id);
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    },
);
routes
    .route("/:assignment_id/assignment-solution/feedback")
    .get(async (req: Request, res: Response) => {
        //TODO: correct user check
        const id: number = +req.params.assignment_id;
        if (!id) {
            res.status(400).send("Assignment ID not a number");
            return;
        }
        const result = await AssignmentController.retrieveAssignmentFeedback(
            id,
            res.locals.jwtPayload.userId,
        );
        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    })
    //TODO: Role middleware
    .post(async (req: Request, res: Response) => {
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
    });

export default routes;
