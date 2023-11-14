import Router, {Request, Response} from "express"
import prisma from "../prisma";
import task_view from "./task_view";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());
routes.use("/:course_id/:session_id/:exercise_id", task_view);

// This file is intended for both accessing all courses and a specific one

routes.route("/")
    .get((req: Request, res: Response) => {
        res.send("This is the course overview");
        return res.sendStatus(200);
    })
    .put((req: Request, res: Response) => {
        res.send("You added a new course in the course overview");
        return res.sendStatus(200);
    });


routes.get("/:course_id", (req: Request, res: Response) => {
    res.send("This is a specific course");
    return res.sendStatus(201);
});

routes.get("/:course_id/:assignment_id", (req: Request, res: Response) => {
    res.send("This is a specific course");
    return res.sendStatus(201);
});


export default routes;