import Router, { Request, Response } from "express";
import prisma from "../prisma";
import auth from "./auth";
import signup from "./signup";
import course from "./course";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.use("/course", course);
routes.use("/login", auth);
routes.use("/sign-up", signup);

// CRUD for Courses
routes
    .route("/")
    .get(async (req: Request, res: Response) => {
        return res.send("u made a GET request");
    })
    .post((req: Request, res: Response) => {
        return res.send("u made a POST request");
    })
    .put((req: Request, res: Response) => {
        return res.send("u made a PUT request");
    })
    .delete((req: Request, res: Response) => {
        return res.send("u made a DELETE request");
    });

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

routes.get("/delay", async (_, res) => {
    await delay(10000);

    res.status(201).send("Delayed");
});

routes.get("/prismatest", async (_, res) => {
    try {
        res.status(201).send(
            `User count from Prisma: ${await prisma.user.count()}`,
        );
    } catch (e) {
        console.error("Error when getting Prisma: " + e);
        res.status(401).send(`Error: ${e}`);
    }
});

export default routes;
