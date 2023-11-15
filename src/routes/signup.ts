import Router, {Request, Response} from "express"

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.put("/", (req: Request, res: Response) => {
    res.send("You created a new sign-in");
    return res.sendStatus(200);
});

export default routes;