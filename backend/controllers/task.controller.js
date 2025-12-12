import prisma from "../lib/prismaClient.js";
import {ROLES} from "../lib/roles.js";

export const createNewTask = async (req, res) => {
    try {
        const requestingUser = req.user
        const {
            title,
            description,
            function_signature,
            test_cases,
            templates,
            boilerplates,
            groupIds,
            isActive
        } = req.body

        if (
            !title?.trim() ||
            !description?.trim() ||
            !function_signature ||
            !test_cases ||
            !templates ||
            !boilerplates
        ) {
            return res.status(400).json({message: "Brakuje wymaganych danych do stworzenia zadania."});
        }
        const safeGroupIds = Array.isArray(groupIds) ? groupIds : [];
        const task = await prisma.task.create({
            data: {
                title,
                description,
                function_signature,
                test_cases,
                templates,
                boilerplates,
                isActive,
                groups: {
                    connect: safeGroupIds.map((id) => ({id}))
                },
                createdById: requestingUser.id,
            }
        })
        res.status(201).json({message: "Zadanie utworzone pomyślnie", task: task})

    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Wystąpił błąd serwera."});
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                groups: true
            }
        });
        res.status(200).json(tasks)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Wystąpił błąd serwera."});
    }
}

export const getStudentTask = async (req, res) => {
    const requestingUser = req.user

    try {
        if (!requestingUser.groupId) {
            return res.status(200).json([]);
        }
        const tasks = await prisma.task.findMany({
            where: {
                groups: {
                    some: {
                        id: requestingUser.groupId
                    }
                },
                isActive: true
            }
        });
        res.status(200).json(tasks)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Wystąpił błąd podczas pobierania zadań."})

    }
}

export const getIndividualTask = async (req, res) => {
    const requestingUser = req.user
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (!task) {
            return res.status(404).json({message: "Zadanie nie zostało znalezione."});
        }
        if (requestingUser.role === ROLES.STUDENT) {
            const hasAccess = task.isActive &&
                requestingUser.groupId &&
                task.groups?.some(g => g.id === requestingUser.groupId);
            if (!hasAccess) {
                return res.status(403).json({message: "Brak dostępu do tego zadania."});
            }
        }
        res.status(200).json(task)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Wystąpił błąd podczas pobierania zadania."})
    }
}