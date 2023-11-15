import { Router } from "express";
import prisma from "../prisma";
import config from "../config";
import http from "http"
import axios from "axios";

const routes = Router();

routes.get("/", (_, res) => {
    console.log("connect");

    res.status(201).send("Hello World!");
});

routes.get("/ex", async (_, res) => {
    console.log("ex")
    axios.get('https://example.com')
        .then(function (r) {
            res.status(r.status || 404).send(r.data);
        });

});

routes.get("/apitest", async (_, res) => {
    console.log("apitset")
    axios.get(config.server.test_runner, {
        //timeout: 2000,
    })
        .then(function (r) {
            res.status(r.status || 404).send(r.data);
        }).catch(r => res.status(501).send(`bad because: ${r}`));


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
