import Router, {Request, Response} from "express"

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.post("/", (req: Request, res: Response) => {
    res.send("This is the login page");
    return res.sendStatus(200);
});

export default routes;