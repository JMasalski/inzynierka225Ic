import prisma from "../lib/prismaClient.js";

export const getSubmissionsForTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const submissions = await prisma.submission.findMany({
            where: { taskId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                createdAt: true,
                languageId: true,
                code: true,
                status: true,
                score: true,
                totalTime: true,
                maxMemory: true,
                testResults: true,

                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                        group: {
                        select:{
                            name: true,
                            }
                        }
                    },
                },
            },
        });

        const submissionsWithStats = submissions.map(sub => {
            const testResults = sub.testResults || [];
            const passedTests = testResults.filter((t) => t.passed).length;
            const totalTests = testResults.length;
            const allPassed = passedTests === totalTests && totalTests > 0;

            return {
                ...sub,
                allPassed,
                passedTests,
                totalTests
            };
        });

        return res.status(200).json({
            data: submissionsWithStats,
            total: submissionsWithStats.length,
        });
    } catch (err) {
        console.error("getSubmissionsForTask error:", err);
        return res.status(500).json({ message: "Błąd pobierania rozwiązań" });
    }
};