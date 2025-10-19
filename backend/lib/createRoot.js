import * as bcrypt from 'bcryptjs'
import { Role} from "@prisma/client";
import prisma from "./prismaClient.js";

import dotenv from 'dotenv'


dotenv.config()
export const createRoot = async () => {
    const rootLogin = process.env.ROOT_LOGIN;
    const rootPassword = process.env.ROOT_PASS;

    if (!rootLogin || !rootPassword) {
        console.error("No credentials root found.");
        return null;
    }
    const existingRoot = await prisma.user.findFirst({
        where: {role: Role.ROOT},
    })

    if (!existingRoot) {
        const hashed = await bcrypt.hash(rootPassword, 10)
        await prisma.user.create({
            data: {
                username: rootLogin,
                password: hashed,
                role: Role.ROOT,
                hasOnboarded: true,
            },
        })
        console.log("Root account created")
    } else {
        console.log(" Root account already exists")
    }

}