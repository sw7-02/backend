import Router, { Request, Response } from "express";
import AuthController, { AuthRes } from "../controllers/AuthController";
import { Err, ResponseResult } from "../lib";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

const genericAuthHandler =
    (
        func: (
            username: string,
            password: string,
        ) => Promise<ResponseResult<AuthRes>>,
    ) =>
    async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send("No username or password provided");
            return;
        }

        const result = await func(username, password);

        if (result instanceof Err) {
            const { code, msg } = result;
            res.status(code).send(msg);
        } else res.send(result);
    };

// No middleware needed on auth-stuff
routes.post("/login", genericAuthHandler(AuthController.login));

routes.post("/sign-up", genericAuthHandler(AuthController.signUp));

export default routes;
