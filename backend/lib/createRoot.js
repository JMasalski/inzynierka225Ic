import * as bcrypt from 'bcryptjs'
import prisma from "./prismaClient.js";
import {ROLES} from "./roles.js"
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
        where: {role: ROLES.ROOT},
    })

    if (!existingRoot) {
        const hashed = await bcrypt.hash(rootPassword, 10)
        await prisma.user.create({
            data: {
                username: rootLogin,
                password: hashed,
                role: ROLES.ROOT,
                hasOnboarded: true,
                firstName: "Root",
                lastName: "Root",
            },
        })
        console.log("Root account created")
    } else {
        console.log(" Root account already exists")
    }

}