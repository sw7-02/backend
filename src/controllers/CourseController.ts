import prisma from "../prisma";
import { Request, Response } from "express";

async function getCourseFromId(req: Request, res: Response) {
    let id = +req.params.id;
    if (isNaN(id)) {
        res.status(404).send("ID is not a number");
        return;
    }

    try {
    } catch (_) {}
}
