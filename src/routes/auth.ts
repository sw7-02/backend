import Router, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { Error, Result } from "../lib";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

const genericAuthHandler =
    (func: (username: string, password: string) => Promise<Result<string>>) =>
    async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!(username && password))
            res.status(400).send("No username or password provided");

        const result = await func(username, password);

        if (typeof result === typeof Error) {
            const { code, msg } = <Error>result;
            res.status(code).send(msg);
        } else res.send(result);
    };

// No middleware needed on auth-stuff
routes.post("/login", genericAuthHandler(AuthController.login));

routes.post("/sign-up", genericAuthHandler(AuthController.signUp));

export default routes;
