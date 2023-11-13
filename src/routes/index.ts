import { Router } from "express";
import prisma from "../prisma";

const routes = Router();

routes.get("/", (_, res) => {
    console.log("connect");

    res.status(201).send("Hello World!");
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