import prisma from "../lib/prismaClient.js";
import {ROLES} from "../lib/roles.js";

const runJudge0Tests = async ({
                                  code,
                                  task,
                                  language_id
                              }) => {
    const languageKeyMap = {
        63: 'javascript',
        71: 'python',
        54: 'cpp'
    };

    const languageKey = languageKeyMap[language_id];
    if (!languageKey) throw new Error("Nieobsługiwany język.");

    const boilerplate = task.boilerplates?.[languageKey];
    if (!boilerplate) throw new Error(`Brak boilerplate dla ${languageKey}.`);

    const fullCode = code + "\n" + boilerplate;
    const testCases = task.test_cases;

    const testResults = [];
    let allPassed = true;
    let totalTime = 0;
    let maxMemory = 0;

    const JUDGE0_URL =
        process.env.SUBMISSION_URL;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        try {
            const submitRes = await fetch(
                `${JUDGE0_URL}?base64_encoded=false&wait=false`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        source_code: fullCode,
                        language_id,
                        stdin: testCase.input,
                        expected_output: testCase.expected_output,
                        cpu_time_limit: 2,
                        memory_limit: 128000
                    })
                }
            );

            const {token} = await submitRes.json();

            let result;
            for (let attempt = 0; attempt < 10; attempt++) {
                await new Promise(r => setTimeout(r, 500));

                const res = await fetch(
                    `${JUDGE0_URL}/${token}?base64_encoded=false`
                );
                result = await res.json();

                if (result.status.id > 2) break;
            }

            if (!result || result.status.id <= 2)
                throw new Error("Timeout Judge0");

            const actualOutput = (result.stdout || '').trim();
            const expectedOutput = (testCase.expected_output || '').trim();
            const passed =
                result.status.id === 3 && actualOutput === expectedOutput;

            if (!passed) allPassed = false;

            const time = parseFloat(result.time || 0);
            const memory = parseInt(result.memory || 0);

            totalTime += time;
            maxMemory = Math.max(maxMemory, memory);

            testResults.push({
                testCase: i + 1,
                input: testCase.input,
                expectedOutput,
                actualOutput,
                passed,
                statusId: result.status.id,
                status: result.status.description,
                time,
                memory,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                message: result.message || null
            });

        } catch (err) {
            allPassed = false;
            testResults.push({
                testCase: i + 1,
                input: testCase.input,
                expectedOutput: testCase.expected_output,
                actualOutput: '',
                passed: false,
                status: 'Error',
                statusId: null,
                time: 0,
                memory: 0,
                stderr: err.message
            });
        }
    }

    const passedCount = testResults.filter(t => t.passed).length;

    return {
        allPassed,
        passedCount,
        totalCount: testResults.length,
        score: Math.round((passedCount / testResults.length) * 100),
        totalTime,
        maxMemory,
        testResults
    };
};

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
    const requestingUser = req.user
    console.log(requestingUser)

    try {
        const {
            page = 0,
            pageSize = 10,
            search = "",
            sortField = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const skip = Number(page) * Number(pageSize);
        const take = Number(pageSize);

        const where = search
            ? {
                OR: [
                    {
                        title: {
                            contains: search,
                        },
                    },
                    {
                        description: {
                            contains: search,
                        },
                    },
                ],
            }
            : {};

        const orderBy = {
            [sortField]: sortOrder === "asc" ? "asc" : "desc",
        };

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take,
                orderBy,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isActive: true,
                    createdAt: true,

                    groups: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },

                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
            }),
            prisma.task.count({ where }),
        ]);

        return res.status(200).json({
            data: tasks,
            total,
        });
    } catch (err) {
        console.error("getAllTasks error:", err);
        return res.status(500).json({
            message: "Wystąpił błąd serwera.",
        });
    }
};


export const getStudentTask = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {groupId: true}
        });

        if (!user?.groupId) {
            return res.status(200).json([]);
        }

        const tasks = await prisma.task.findMany({
            where: {
                isActive: true,
                groups: {
                    some: {
                        id: user.groupId
                    }
                }
            }
        });

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Wystąpił błąd podczas pobierania zadań."
        });
    }
};

export const getIndividualTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {groupId: true, role: true}
        });

        if (!user) {
            return res.status(401).json({message: "Nieautoryzowany dostęp."});
        }

        const task = await prisma.task.findUnique({
            where: {id: taskId},
            include: {
                groups: {select: {id: true}}
            }
        });

        if (!task) {
            return res.status(404).json({message: "Zadanie nie zostało znalezione."});
        }

        if (user.role === ROLES.STUDENT) {
            const hasAccess =
                task.isActive &&
                user.groupId &&
                task.groups.some(g => g.id === user.groupId);

            if (!hasAccess) {
                return res.status(403).json({message: "Brak dostępu do tego zadania."});
            }
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Wystąpił błąd podczas pobierania zadania."
        });
    }
};


export const runTask = async (req, res) => {
    try {
        const {code, taskId, language_id} = req.body;

        const task = await prisma.task.findUnique({where: {id: taskId}});
        if (!task) return res.status(404).json({error: "Nie znaleziono zadania"});

        if (!task.isActive) return res.status(403).json({error: "To zadanie nie jest już aktywne."});

        const result = await runJudge0Tests({
            code,
            task,
            language_id
        });

        res.json({
            mode: "RUN",
            ...result
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};


export const submitTask = async (req, res) => {
    const userId = req.user.id;

    try {
        const {code, taskId, language_id} = req.body;

        const task = await prisma.task.findUnique({where: {id: taskId}});
        if (!task || !task.isActive)
            return res.status(403).json({error: "Task inactive"});

        const result = await runJudge0Tests({
            code,
            task,
            language_id
        });

        await prisma.submission.upsert({
            where: {
                userId_taskId: {userId, taskId}
            },
            update: {
                code,
                languageId: language_id,
                status: result.allPassed ? "PASSED" : "FAILED",
                score: result.score,
                testResults: result.testResults,
                totalTime: result.totalTime,
                maxMemory: result.maxMemory
            },
            create: {
                userId,
                taskId,
                code,
                languageId: language_id,
                status: result.allPassed ? "PASSED" : "FAILED",
                score: result.score,
                testResults: result.testResults,
                totalTime: result.totalTime,
                maxMemory: result.maxMemory
            }
        });

        res.json({
            mode: "SUBMIT",
            ...result
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

export const toggleTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "Nieprawidłowa wartość isActive",
            });
        }

        const task = await prisma.task.update({
            where: { id },
            data: { isActive },
            select: {
                id: true,
                isActive: true,
            },
        });

        return res.status(200).json(task);
    } catch (err) {
        console.error("toggleTaskStatus error:", err);
        return res.status(500).json({
            message: "Błąd podczas zmiany statusu zadania",
        });
    }
};

export const deleteTasks = async (req, res) => {

    try {


        const {taskIds: taskIds} = req.body;

        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({message: "Musisz podać listę taskIds."});
        }

        const existingTasks = await prisma.task.findMany({
            where: {id: {in: taskIds}}
        });

        if (existingTasks.length === 0) {
            return res.status(404).json({message: "Żadne z podanych zadań nie istnieje."});
        }

        await prisma.task.deleteMany({
            where: {id: {in: taskIds}}
        });

        return res.status(200).json({
            message: "Zadania zostały pomyślnie usunięte.",
            deletedCount: existingTasks.length
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Wystąpił błąd podczas usuwania zadań."});
    }
};






