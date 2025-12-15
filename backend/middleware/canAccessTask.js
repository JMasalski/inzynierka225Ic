import prisma from "../lib/prismaClient.js";
import {ROLES} from "../lib/roles.js";

export const canAccessTask = async (req, res, next) => {
    const {taskId} = req.body;
    if (!taskId) {
        return res.status(400).json({error: "Brak identyfikatora zadania."});
    }
    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        select: {groupId: true, role: true}
    });


    if (!user) {
        return res.status(401).json({error: "Nieautoryzowany dostęp."});
    }

    if (user.role === ROLES.STUDENT) {
        const task = await prisma.task.findUnique({
            where: {id: taskId},
            include: {groups: {select: {id: true}}}
        });

        if (!task?.groups?.some(g => g.id === user.groupId)) {
            return res.status(403).json({error: "Brak dostępu do tego zadania."});
        }
    }

    next();
}
