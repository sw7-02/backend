import Router, {Request, Response} from "express"
import prisma from "../prisma";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", (req: Request, res: Response) => {
    res.send("This is the task_view");
    return res.sendStatus(200);
});

export default routes;