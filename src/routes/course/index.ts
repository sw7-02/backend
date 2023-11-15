import Router, {Request, Response} from "express"
import exercise from "./exercise";
import assignment from "./assignment";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.use("/:course_id/:session_id/:exercise_id", exercise);
routes.use("/:course_id/:assignment_id", assignment);

// This file is intended for both accessing all courses and a specific one
routes.route("/")
    .get((req: Request, res: Response) => {
        res.send("This is the course overview");
        return res.sendStatus(201);
    })
    .put((req: Request, res: Response) => {
        res.send("You added a new course in the course overview");
        return res.sendStatus(201);
    });

routes.get("/:course_id", (req: Request, res: Response) => {
    res.send("This is a specific course");
    return res.sendStatus(201);
});

routes.get("/:course_id/:session_id", (req: Request, res: Response) => {
    res.send("You just retrieved all exercises within the specific session");
    return res.sendStatus(201);
});

routes.get("/:course_id/:assignment_id", (req: Request, res: Response) => {
    res.send("This is a specific asssignment");
    return res.sendStatus(201);
});

// leaderboards
routes.get("/:course_id/leaderboard", (req: Request, res: Response) => {
    res.send("This is the leaderboard");
    return res.sendStatus(201);
});

export default routes;