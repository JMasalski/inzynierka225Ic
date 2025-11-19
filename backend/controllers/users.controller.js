import { ROLES } from "../lib/roles.js";
import prisma from "../lib/prismaClient.js";

export const getAllUsers = async (req, res) => {
    const requestingUser = req.user;

    try {
        if (
            requestingUser.role !== ROLES.ROOT &&
            requestingUser.role !== ROLES.TEACHER
        ) {
            return res.status(403).json({ message: "Brak uprawnień" });
        }

        const page = Number(req.query.page ?? 0);
        const pageSize = Number(req.query.pageSize ?? 10);

        const allowedSortFields = ["firstName", "lastName", "username", "role"];
        let sortField = req.query.sortField || "lastName";
        const sortOrder = req.query.sortOrder || "desc";

        if (!allowedSortFields.includes(sortField)) {
            sortField = "lastName";
        }

        const search = req.query.search || "";

        const where = {
            role: { not: ROLES.ROOT },
            OR: search && search.trim()
                ? [
                    { firstName: { contains: search} },
                    { lastName: { contains: search }},
                    { username: { contains: search }}
                ]
                : undefined
        };

        const users = await prisma.user.findMany({
            where,
            skip: page * pageSize,
            take: pageSize,
            orderBy: {
                [sortField]: sortOrder,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                group: {
                    select: { name: true,id: true },
                },
                username: true
            }
        });

        const total = await prisma.user.count({ where });

        return res.status(200).json({
            data: users,
            total
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Błąd serwera" });
    }
};

export const deleteUsers = async (req, res) => {
    const requestingUser = req.user;

    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({ message: "Nie masz uprawnień do usuwania użytkowników." });
        }

        const { usersIds } = req.body;

        if (!usersIds || !Array.isArray(usersIds) || usersIds.length === 0) {
            return res.status(400).json({ message: "Musisz podać listę użytkowników." });
        }

        const existingUsers = await prisma.user.findMany({
            where: { id: { in: usersIds } }
        });

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: "Żaden z podanych użytkowników nie istnieje." });
        }

        const deleted = await prisma.user.deleteMany({
            where: { id: { in: usersIds } }
        });

        return res.status(200).json({
            message: "Użytkownicy zostali pomyślnie usunięci.",
            deletedCount: deleted.count
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Wystąpił błąd podczas usuwania użytkowników." });
    }
};

