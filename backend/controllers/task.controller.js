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
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { groupId: true }
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
            where: { id: userId },
            select: { groupId: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ message: "Nieautoryzowany dostęp." });
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                groups: { select: { id: true } }
            }
        });

        if (!task) {
            return res.status(404).json({ message: "Zadanie nie zostało znalezione." });
        }

        if (user.role === ROLES.STUDENT) {
            const hasAccess =
                task.isActive &&
                user.groupId &&
                task.groups.some(g => g.id === user.groupId);

            if (!hasAccess) {
                return res.status(403).json({ message: "Brak dostępu do tego zadania." });
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

export const submitTask = async (req, res) => {
    const userId = req.user.id;
    try {
        const {code, taskId, language_id} = req.body;


        if (!code || !taskId || !language_id) {
            return res.status(400).json({error: "Brakuje wymaganych danych."});
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            return res.status(404).json({error: "Nie znaleziono zadania."});
        }

        if (!task.isActive) {
            return res.status(403).json({error: "To zadanie nie jest już aktywne."});
        }

        const testCases = task.test_cases;

        if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({error: "Zadanie nie ma test cases."});
        }

        const languageKeyMap = {
            63: 'javascript',  // JavaScript (Node.js)
            71: 'python',      // Python 3
            54: 'cpp'          // C++ (GCC 9.2.0)
        };

        const languageKey = languageKeyMap[language_id];

        if (!languageKey) {
            return res.status(400).json({error: "Nieobsługiwany język."});
        }

        const boilerplate = task.boilerplates?.[languageKey];

        if (!boilerplate) {
            return res.status(400).json({error: `Brak boilerplate dla języka ${languageKey}.`});
        }

        const fullCode = code + "\n" + boilerplate;

        const testResults = [];
        let allPassed = true;
        let totalTime = 0;
        let maxMemory = 0;

        const JUDGE0_URL = process.env.SUBMISSION_URL || 'http://192.168.0.193:2358/submissions';

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];

            try {
                const submissionResponse = await fetch(`${JUDGE0_URL}?base64_encoded=false&wait=false`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        source_code: fullCode,
                        language_id: language_id,
                        stdin: testCase.input,
                        expected_output: testCase.expected_output,
                        cpu_time_limit: 2,
                        memory_limit: 128000
                    })
                });

                if (!submissionResponse.ok) {
                    throw new Error(`Judge0 API error: ${submissionResponse.status}`);
                }

                const submissionData = await submissionResponse.json();
                const token = submissionData.token;

                let result = null;
                let attempts = 0;
                const maxAttempts = 10;

                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const resultResponse = await fetch(`${JUDGE0_URL}/${token}?base64_encoded=false`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!resultResponse.ok) {
                        throw new Error(`Błąd w pobiernaiu z JUDGE0 : ${resultResponse.status}`);
                    }

                    result = await resultResponse.json();

                    // Status ID: 1=In Queue, 2=Processing, 3=Accepted, 4+=Various errors
                    if (result.status.id > 2) {
                        break;
                    }

                    attempts++;
                }

                if (!result || result.status.id <= 2) {
                    throw new Error('Timeout waiting for Judge0 result');
                }

                const actualOutput = (result.stdout || '').trim();
                const expectedOutput = (testCase.expected_output || '').trim();
                const passed = actualOutput === expectedOutput && result.status.id === 3; // 3 = Accepted

                if (!passed) {
                    allPassed = false;
                }

                const time = parseFloat(result.time || 0);
                const memory = parseInt(result.memory || 0);
                totalTime += time;
                maxMemory = Math.max(maxMemory, memory);

                testResults.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: expectedOutput,
                    actualOutput: actualOutput,
                    passed: passed,
                    statusId: result.status.id,
                    status: result.status.description || 'Unknown',
                    time: time,
                    memory: memory,
                    stderr: result.stderr || null,
                    compile_output: result.compile_output || null,
                    message: result.message || null
                });
            } catch (error) {
                console.error(`Error testing case ${i + 1}:`, error);
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
                    stderr: error.message,
                    compile_output: null,
                    message: 'Test execution failed'
                });
            }
        }

        const passedCount = testResults.filter(r => r.passed).length;
        const totalCount = testResults.length;
        const score = Math.round((passedCount / totalCount) * 100);

        const submission = await prisma.submission.upsert({
            where: {
                userId_taskId: {
                    userId: userId,
                    taskId: taskId
                }
            },
            update: {
                code: code,
                languageId: language_id,
                status: allPassed ? 'PASSED' : 'FAILED',
                score: score,
                testResults: testResults,
                totalTime: totalTime,
                maxMemory: maxMemory
            },
            create: {
                userId: userId,
                taskId: taskId,
                code: code,
                languageId: language_id,
                status: allPassed ? 'PASSED' : 'FAILED',
                score: score,
                testResults: testResults,
                totalTime: totalTime,
                maxMemory: maxMemory
            }
        });

        return res.status(200).json({
            success: true,
            allPassed: allPassed,
            score: score,
            passedTests: passedCount,
            totalTests: totalCount,
            totalTime: totalTime.toFixed(3),
            maxMemory: maxMemory,
            testResults: testResults
        });

    } catch (err) {
        console.error('Error in submitTask:', err);
        return res.status(500).json({
            error: "Błąd podczas testowania kodu.",
        });
    }
};