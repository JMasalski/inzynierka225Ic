import {create} from "zustand/index";
import {Task} from "@/app/(protected)/teacher-dashboard/new-task/page";
import {axiosInstance} from "@/lib/axiosInstance";
import {toast} from "sonner";

type AssignedGroup = {
    id: string;
    name: string;
};

type GetAllTasksParams = {
    page: number
    pageSize: number
    search?: string
    sortField?: string
    sortOrder?: "asc" | "desc"
}
type TestResult = {
    testCase: number
    passed: boolean
    status: string
    input: string
    expectedOutput: string
    actualOutput: string
    stderr?: string
    compile_output?: string
    time: number
    memory: number
}

type SubmitResponse = {
    allPassed: boolean
    passedTests: number
    totalTests: number
    score: number
    totalTime: number
    maxMemory: number
    testResults: TestResult[]
}

type SubmitData = {
    code:string,
    language_id:number,
    taskId:string,
}
type TaskState = {

    getAllTasks: (params: GetAllTasksParams) => Promise<void>;
    tasks: Task[];
    total: number;
    assignedGroups: AssignedGroup[];
    groupsLoading: boolean;

    getAssignedGroups: (taskId: string) => Promise<void>;
    updateAssignedGroups: (taskId: string, groupIds: string[]) => Promise<void>;
    toggleTaskStatus: (taskId: string, isActive: boolean) => Promise<void>;

    addTask: (data: Task) => Promise<void>;
    getStudentTasks: () => Promise<void>;
    getIndividualTask: (id: string) => Promise<void>;
    loading: boolean;
    taskCheckLoad: boolean;
    studentTasks: Task[]
    individualTask: Task | null
    submitTask: (data:SubmitData) => Promise<void>
    runTask: (data:SubmitData) => Promise<void>
    deleteTasks: (ids: string[]) => Promise<void>;
    submitResponse: SubmitResponse | null;
    clearSubmitResponse: () => void
}
export const useTaskStore = create<TaskState>((set,get) => ({
    loading: false,
    studentTasks: [],
    individualTask: null,
    submitResponse: null,
    taskCheckLoad: false,
    tasks: [],
    total: 0,
    assignedGroups: [],
    groupsLoading: false,

    clearSubmitResponse: () => set({submitResponse: null}),

    addTask: async (data) => {
        try {
            set({loading: true});
            const res = await axiosInstance.post("/api/v1/task", data)
            toast.success(res.data.message)

        } catch (error: any) {
            console.log(error);
            toast.error(error.response?.data?.message || "Wystąpił błąd podczas tworzenia zadania.")

        } finally {
            set({loading: false});
        }
    },
    getStudentTasks: async () => {
        try {
            set({loading: true})
            const res = await axiosInstance.get("/api/v1/task/student-task")
            set({studentTasks: res.data})

        } catch (e:any) {
            console.log(e)
            toast.error(e.response?.data?.message || "Wystąpił błąd podczas pobierania zadania.")

        } finally {
            set({loading: false})
        }
    },

    getIndividualTask: async (id) => {
        try {
            set({loading: true})
            const res = await axiosInstance.get(`/api/v1/task/${id}`)
            console.log(res)
            set({individualTask: res.data})

        } catch (e:any) {
            console.log(e)
            toast.error(e.response?.data?.message || "Wystąpił błąd podczas pobierania zadania.")

        } finally {
            set({loading: false});

        }
    },

    submitTask: async (data) => {
        try {
            set({taskCheckLoad: true});
            const res = await axiosInstance.post("/api/v1/task/save-submission", data)
            set({submitResponse: res.data})
        } catch (error: any) {
            set({submitResponse: null});
            toast.error(error.response?.data?.message || "Wystąpił błąd podczas zapisywania zadania.")
        } finally {
            set({taskCheckLoad: false});
        }
    },
    runTask: async (data) => {
        try {
            set({taskCheckLoad: true});
            const res = await axiosInstance.post("/api/v1/task/run", data)
            set({submitResponse: res.data})
        } catch (error: any) {
            console.log(error);
            set({submitResponse: null});
            toast.error(error.response?.data?.message || "Wystąpił błąd podczas uruchamiania testów.")

        } finally {
            set({taskCheckLoad: false});
        }
    },
    getAllTasks: async ({page, pageSize, search, sortField, sortOrder}) => {

        try {
            set({loading: true});

            const res = await axiosInstance.get("/api/v1/task", {
                params: {
                    page,
                    pageSize,
                    search,
                    sortField,
                    sortOrder,
                },
            });

            set({
                tasks: res.data.data,
                total: res.data.total,
            });
        } catch (error: any) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Nie udało się pobrać zadań."
            );
        } finally {
            set({loading: false});
        }
    },

    toggleTaskStatus: async (taskId: string, isActive: boolean) => {
        try {
            await axiosInstance.patch(`/api/v1/task/${taskId}/status`, {
                isActive,
            });

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === taskId ? {...task, isActive} : task
                ),
            }));
        } catch (error) {

            toast.error("Nie udało się zmienić statusu zadania");
            throw error;
        }
    },
    deleteTasks: async (ids) => {
        try {
            set({loading: true});

            await axiosInstance.delete("/api/v1/task", {
                data: {taskIds: ids},
            });

            toast.success("Zadania zostały usunięte");

            // odśwież listę
            await get().getAllTasks({
                page: 0,
                pageSize: 10,
            });
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Błąd podczas usuwania zadań"
            );
        } finally {
            set({loading: false});
        }
    },
    getAssignedGroups: async (taskId: string) => {
        try {
            set({groupsLoading: true});

            const res = await axiosInstance.get(
                `/api/v1/task/${taskId}/groups`
            );

            set({
                assignedGroups: res.data,
            });

        } catch (error: any) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Nie udało się pobrać przypisanych grup"
            );
        } finally {
            set({groupsLoading: false});
        }
    },
    updateAssignedGroups: async (taskId: string, groupIds: string[]) => {
        try {
            set({groupsLoading: true});

            await axiosInstance.put(
                `/api/v1/task/${taskId}/groups`,
                {groupIds}
            );

            toast.success("Grupy zostały zaktualizowane");

            await get().getAssignedGroups(taskId);

        } catch (error: any) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Nie udało się zaktualizować grup"
            );
        } finally {
            set({groupsLoading: false});
        }
    },



}))
