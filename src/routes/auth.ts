import Router, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import {Error} from "../lib";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());


// No middleware needed on auth-stuff
routes.post("/login", async (req: Request, res: Response) => {
    const result = await AuthController.login(req.params.username, req.params.password);

    if (typeof result === typeof Error)
        res.status((<Error>result).code).send((<Error>result).msg);
    else
        res.send(result)
});

routes.post("/sign-up", async (req: Request, res: Response) => {
    const result = await AuthController.signUp(req.params.username, req.params.password);

    if (typeof result === typeof Error)
        res.status((<Error>result).code).send((<Error>result).msg);
    else
        res.send(result)
});

export default routes;
