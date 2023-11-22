import Router, { Request, Response } from "express";
import exercise from "./exercise";
import { validateJWT } from "../../../middlewares/validateJWT";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());
// TODO: Uncomment when ready
routes.use("/:session_id/exercise", exercise);
//routes.use("/:session_id/exercise", [SESSION-ID-SAVE-MIDDLEWARE], exercise);

routes.get("/", (req: Request, res: Response) => {
    res.send("This is the session overview");
    return res.sendStatus(201);
});

routes.get("/:session_id", (req: Request, res: Response) => {
    res.send("This is the a specific session");
});

routes.put("/:session_id", (req: Request, res: Response) => {
    res.send("You have just updated a session");
    return res.sendStatus(201);
});

routes.delete("/:session_id", (req: Request, res: Response) => {
    res.send("You have just deleted a session");
    return res.sendStatus(201);
});

export default routes;
