import { NextFunction, Request, Response } from "express";

function saveExerciseId(req: Request, res: Response, next: NextFunction) {
    const id: number = +req.params.exercise_id;
    if (!id) {
        res.status(400).send("Exercise ID not a number");
        return;
    }
    res.locals.exerciseId = id;
    next();
}

function saveAssignmentId(req: Request, res: Response, next: NextFunction) {
    const id: number = +req.params.assignment_id;
    if (!id) {
        res.status(400).send("Assignment ID not a number");
        return;
    }
    res.locals.assignmentId = id;
    next();
}

function saveSessionId(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.session_id;

    if (!id) {
        res.status(400).send("Session ID not a number");
        return;
    }
    res.locals.sessionId = id;
    next();
}

export { saveSessionId, saveAssignmentId, saveExerciseId };
