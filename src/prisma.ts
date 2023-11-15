import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient().$extends({
        model: {
            user: {
                async signUp(email: string, password: string) {
                    const hash = await bcrypt.hash(password, 10);
                    return prisma.user.create({
                        data: {
                            username: email,
                            user_password: hash,
                        },
                    });
                },
            },
        },
    });

globalForPrisma.prisma = prisma;

export default prisma;
