import Router, {Request, Response} from "express"

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.get("/", (req: Request, res: Response) => {
    res.send("This is the login page");
    // TODO: lave en redirect eller sendFile til login form
        // res.sendFile(__dirname + "public/login.html");
    return res.sendStatus(200);
});

export default routes;