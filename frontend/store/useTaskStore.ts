import {create} from "zustand/index";
import {Task} from "@/app/(protected)/teacher-dashboard/new-task/page";
import {axiosInstance} from "@/lib/axiosInstance";
import {toast} from "sonner";


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
    addTask: (data: Task) => Promise<void>;
    getStudentTasks: () => Promise<void>;
    getIndividualTask: (id: string) => Promise<void>;
    loading: boolean;
    taskCheckLoad: boolean;
    studentTasks: Task[]
    individualTask: Task | null
    submitTask: (data:SubmitData) => Promise<void>
    runTask: (data:SubmitData) => Promise<void>

    submitResponse: SubmitResponse | null;
    clearSubmitResponse: () => void
}
export const useTaskStore = create<TaskState>((set) => ({
    loading: false,
    studentTasks: [],
    individualTask: null,
    submitResponse:null,
    taskCheckLoad: false,

    clearSubmitResponse: () => set({ submitResponse: null }),

    addTask: async (data) => {
        try {
            set({loading: true});
            const res = await axiosInstance.post("/api/v1/task", data)
            console.log(res)
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
            console.log("TASKS HOME PAGE",res)
            set({studentTasks: res.data})

        } catch (e) {
            console.log(e)

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

        } catch (e) {
            console.log(e)


        } finally {
            set({loading: false});

        }
    },

    submitTask:async(data)=>{
        try{
            console.log("Zaczynam sprawdzac")

            set({taskCheckLoad: true});
            const res = await axiosInstance.post("/api/v1/task/save-submission", data)
            console.log(res)
            set({submitResponse: res.data})
        }catch(error:any){
            set({ submitResponse: null });
            toast.error(error.response?.data?.message || "Wystąpił błąd podczas tworzenia zadania.")
        }finally {
            set({taskCheckLoad: false});
        }
    },
    runTask:async(data)=>{
        try {
            set({taskCheckLoad: true});
            const res = await axiosInstance.post("/api/v1/task/run", data)
            console.log(res)
            set({submitResponse: res.data})
        }catch(error:any){
            console.log(error);
            set({ submitResponse: null });
            toast.error(error.response?.data?.message || "Wystąpił błąd podczas zapisywania odpowiedzi.")

        }finally {
            set({taskCheckLoad: false});
        }
    }

}))
