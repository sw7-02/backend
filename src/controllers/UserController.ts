import prisma from "../prisma";
import { Request, Response } from "express";

async function listAll(req: Request, res: Response) {
    //Get users from database
    const users = await prisma.user.findMany({
        select: { user_id: true, username: true },
    });

    //Send the users object
    res.send(users);
}

async function getUsernameById(req: Request, res: Response) {
    let id = res.locals.jwtPayload.userId;

    //Get users from database
    try {
        await prisma.user
            .findFirstOrThrow({
                where: { user_id: id },
                select: { username: true },
            })
            .then(
                (user) => res.send(user),
                (_) => res.status(500).send(),
            );
    } catch (e) {
        res.status(301).send();
    }
}

export { getUsernameById, listAll };
