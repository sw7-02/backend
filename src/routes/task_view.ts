import Router, {Request, Response} from "express"
import exercise_solutions from './exercise_solutions';

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.use("/", exercise_solutions);


routes.get("/", (req: Request, res: Response) => {
    res.send("This is the task_view");
    return res.sendStatus(200);
});

export default routes;