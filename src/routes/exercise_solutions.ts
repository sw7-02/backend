import Router, {Request, Response} from "express";
import Express from "express";

// mergeParams makes it possible to access parameters such as session:id and exercise:id
const routes = Express.Router({mergeParams:true});

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", (req: Request, res: Response) => {
    res.send(req.params);
    return res.sendStatus(200);
});

export default routes;