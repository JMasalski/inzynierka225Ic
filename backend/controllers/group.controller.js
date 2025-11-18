import prisma from "../lib/prismaClient.js";
import {ROLES} from "../lib/roles.js";

//TODO PODODAWAC ERROR HANDLING

export const getAllGroupes = async (req, res) => {
    const requestingUser = req.user;

    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({ message: "Brak uprawnień" });
        }

        const page = Number(req.query.page) || 0;
        const pageSize = Number(req.query.pageSize) || 10;

        const sortField = req.query.sortField || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";

        const search = req.query.search || "";

        const total = await prisma.group.count({
            where: {
                name: {
                    contains: search,
                }
            }
        });

        const groups = await prisma.group.findMany({
            where: {
                name: {
                    contains: search,
                }
            },
            skip: page * pageSize,
            take: pageSize,
            orderBy: {
                [sortField]: sortOrder
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                _count: { select: { students: true } }
            }
        });

        return res.status(200).json({
            data: groups,
            total
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Błąd serwera" });
    }
};
export const getGroup = async (req, res) => {
    const requestingUser = req.user;
    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({message: "Nie masz uprawnień by dodawać do grup"});
        }
        const group = await prisma.group.findUnique({
            where: {id: req.params.id},
            select: {
                id: true,
                name: true,
                students: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                    }
                }
            }

        })
        return res.status(200).json(group);
    } catch (err) {
        console.log(err);
    }
}
export const createGroup = async (req, res) => {
    const {name} = req.body;
    const requestingUser = req.user;

    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({message: "Nie masz uprawnień by utworzyć grupę"});
        }

        if (!name || !name.trim()) {
            return res.status(400).json({message: "Nazwa grupy jest wymagana."});
        }

        const existingGroup = await prisma.group.findUnique({
            where: {name}
        });

        if (existingGroup) {
            return res.status(400).json({message: "Grupa o tej nazwie już istnieje."});
        }

        const newGroup = await prisma.group.create({
            data: {name}
        });

        return res.status(201).json({
            message: "Grupa utworzona pomyślnie",
            group: newGroup,
        });

    } catch (err) {
        console.error(err);


        return res.status(500).json({message: "Błąd podczas tworzenia grupy"});
    }
};

export const addStudnetToGroup = async (req, res) => {
    const requestingUser = req.user;
    const {studentsIds} = req.body;
    const groupId = req.params.id;
    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({message: "Nie masz uprawnień by dodawać do grup"});
        }
        const existingGroup = await prisma.group.findUnique({
            where: {id: groupId}
        })

        if (!existingGroup) {
            return res.status(400).json({message:"nie znaleziony grtupy"})
        }
        await prisma.user.updateMany({
            where: {id: {in: studentsIds}},
            data: {groupId: req.params.id},
        })

        return res.status(200).json({message: "Uczniowie zostali dodani do grupy"})
    } catch (err) {
        console.error(err);
    }
}

export const deleteGroup = async (req, res) => {
    const requestingUser = req.user;

    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({ message: "Nie masz uprawnień do usuwania grup." });
        }

        const { groupIds } = req.body;

        if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
            return res.status(400).json({ message: "Musisz podać listę groupIds." });
        }

        const existingGroups = await prisma.group.findMany({
            where: { id: { in: groupIds } }
        });

        if (existingGroups.length === 0) {
            return res.status(404).json({ message: "Żadna z podanych grup nie istnieje." });
        }

        // usuwanie wielu naraz
        await prisma.group.deleteMany({
            where: { id: { in: groupIds } }
        });

        return res.status(200).json({
            message: "Grupy zostały pomyślnie usunięte.",
            deletedCount: existingGroups.length
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Wystąpił błąd podczas usuwania grup." });
    }
};
export const removeStudentFromGroupe = async (req, res) => {
    const requestingUser = req.user;
    const {studentsIds} = req.body;
    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({message: "Nie masz uprawnień by usuwać uczniów z grupy"});
        }
        await prisma.user.updateMany({
            where: {
                id: {in: studentsIds},
                groupId: req.params.id
            },
            data: {
                groupId: null
            }
        });

        return res.status(200).json({message: "Uczniowie zostali usunięci z grupy"})

    } catch (err) {
        console.error(err);
    }
}
export const updateGroup = async (req, res) => {
    const requestingUser = req.user;
    const {name} = req.body;
    try {
        if (requestingUser.role !== ROLES.ROOT && requestingUser.role !== ROLES.TEACHER) {
            return res.status(403).json({message: "Nie masz uprawnień by dodawać do grup"});
        }
        if (!name || !name.trim()) {
            return res.status(400).json({message: "Nazwa grupy jest wymagana."});
        }

        const existingGroup = await prisma.group.findUnique({
            where: {name}
        });

        if (existingGroup) {
            return res.status(400).json({message: "Grupa o tej nazwie już istnieje."});
        }

        await prisma.group.update({
            where: {id: req.params.id},
            data: {name},
        })

        return res.status(200).json({message: "Nazwa grupy zmieniona pomyślnie"})
    } catch (err) {
        console.log(err);
    }
}