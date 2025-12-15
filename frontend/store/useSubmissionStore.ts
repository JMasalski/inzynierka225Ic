import { create } from "zustand";
import { toast } from "sonner";
import {axiosInstance} from "@/lib/axiosInstance";

/* ================= TYPES ================= */

export type SubmissionUser = {
    id: string;
    firstName?: string;
    lastName?: string;
    username: string;
};

export type Submission = {
    id: string;
    createdAt: string;
    languageId: number;
    sourceCode: string;

    allPassed: boolean;
    passedTests: number;
    totalTests: number;
    score: number;
    totalTime: number;
    maxMemory: number;

    user: SubmissionUser;
};

type SubmissionState = {
    submissions: Submission[];
    total: number;
    loading: boolean;

    selectedSubmission: Submission | null;

    getSubmissionsForTask: (taskId: string) => Promise<void>;
    setSelectedSubmission: (submission: Submission | null) => void;
    clearSubmissions: () => void;
};


export const useSubmissionStore = create<SubmissionState>((set) => ({
    submissions: [],
    total: 0,
    loading: false,

    selectedSubmission: null,

    getSubmissionsForTask: async (taskId: string) => {
        try {
            set({ loading: true });

            const res = await axiosInstance.get(
                `/api/v1/submission/task/${taskId}`
            );

            set({
                submissions: res.data.data,
                total: res.data.total,
            });
        } catch (error: any) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Nie udało się pobrać rozwiązań"
            );
        } finally {
            set({ loading: false });
        }
    },

    setSelectedSubmission: (submission) =>
        set({ selectedSubmission: submission }),

    clearSubmissions: () =>
        set({
            submissions: [],
            total: 0,
            selectedSubmission: null,
        }),
}));
