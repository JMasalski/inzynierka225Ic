import prisma from "../lib/prismaClient.js";
import {ROLES} from "../lib/roles.js";

export const canAccessTask = async (req, res, next) => {
    const { taskId } = req.body;
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { groupId: true, role: true }
    });

    if (user.role === ROLES.STUDENT) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { groups: { select: { id: true } } }
        });

        if (!task?.groups.some(g => g.id === user.groupId)) {
            return res.status(403).json({ error: "Brak dostępu do tego zadania." });
        }
    }

    next();
};