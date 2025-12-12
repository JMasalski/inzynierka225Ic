import {create} from "zustand/index";
import {Task} from "@/app/(protected)/teacher-dashboard/new-task/page";
import {axiosInstance} from "@/lib/axiosInstance";
import {toast} from "sonner";



type TaskState = {
    addTask: (data: Task) => Promise<void>;
    getStudentTasks: () => Promise<void>;
    getIndividualTask: (id:string) => Promise<void>;
    loading: boolean;
    studentTasks:Task[]
    individualTask:Task | null
}
export const useTaskStore = create<TaskState>((set) => ({
    loading:false,
    studentTasks:[],
    individualTask:null,
    addTask:async(data)=>{
        try {
            set({loading:true});
            const res = await axiosInstance.post("/api/v1/task",data)
            console.log(res)
            toast.success(res.data.message)

        }catch(error:any){
            console.log(error);
            toast.error(error.data.message)

        }finally{
            set({loading:false});
        }
    },
    getStudentTasks:async()=>{
        try{
            set({loading:true})
            const res = await axiosInstance.get("/api/v1/task/student-task")
            console.log(res)
            set({studentTasks: res.data})

        }catch (e)
        {
            console.log(e)

        }finally {
            set({loading:false})
        }
    },

    getIndividualTask:async(id)=>
    {
        try{
            set({loading:true})
            const res = await axiosInstance.get(`api/v1/task/${id}`)
            console.log(res)
            set({individualTask:res.data})

        }catch (e){
            console.log(e)


        }finally {
            set({loading:false});

        }
    }

}))
