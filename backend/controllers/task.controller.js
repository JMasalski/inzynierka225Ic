import prisma from "../lib/prismaClient.js";

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
            groupIds
        } = req.body

        if (
            !title?.trim() ||
            !description?.trim() ||
            !function_signature ||
            !test_cases ||
            !templates ||
            !boilerplates
        ) {
            return res.status(400).json({ message: "Brakuje wymaganych danych do stworzenia zadania." });
        }
        const safeGroupIds = Array.isArray(groupIds) ? groupIds : [];
        const task = await prisma.task.create({
            data:{
                title,
                description,
                function_signature,
                test_cases,
                templates,
                boilerplates,
                groups: {
                    connect:safeGroupIds.map((id)=>({id}))
                },
                createdById: requestingUser.id,
            }
        })
        res.status(201).json({meesage:"Zadanie utworzone",task:task})

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Wystąpił błąd serwera." });
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
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Wystąpił błąd serwera."});
    }
}