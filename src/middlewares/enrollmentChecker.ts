import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkEnrollment(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    const userId = req.params.userId;
    const courseId = req.params.course_id;

    try {
        await prisma.enrollment.findUniqueOrThrow({
            where: {
                user_id: userId,
                course_id: courseId
            }
        });
    } catch (error) {
        res.status(403).send();
    }

    next();
}