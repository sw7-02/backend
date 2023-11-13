import Router, {Request, Response} from "express"
import prisma from "../prisma";
import task from './task_view';

const routes = Router();

// enables passing json bodies.
    // express.json() is middleware
routes.use(Router.json());
routes.use("/", task);

// enables passing urlencoded bodies. Don't enable if not necessary.
//app.use(express.urlencoded({extended: true}))


routes.get("/:id", (req: Request, res: Response) => {
    return res.sendStatus(200);
});

export default routes;