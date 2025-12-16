"use client"
import {useTaskStore} from "@/store/useTaskStore";
import Loader from "@/components/Loader";
import {useEffect} from "react";
import {Info} from "lucide-react";
import {TaskCard} from "@/app/(protected)/home/components/TaskCard";

export default function Page() {

    const {studentTasks, getStudentTasks, loading} = useTaskStore()

    useEffect(() => {
        getStudentTasks()
    }, [])

    if (loading) return <Loader/>

    if (studentTasks.length===0) return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Info className="w-8 h-8 text-blue-500"/>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Brak dostępnych zadań
            </h2>

            <p className="text-gray-600 max-w-md">
                Obecnie nie masz przypisanych żadnych zadań.
                Sprawdź ponownie później — nauczyciel może je dodać w każdej chwili.
            </p>
        </div>

    )

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {studentTasks.map((task) => (
                <TaskCard
                    key={task.id}
                    taskId={task.id!}
                    title={task.title}
                    createdBy={`${task.createdBy!.firstName} 
                    ${task.createdBy!.lastName}`}
                    description={task.description}
                    hasSubmission={task.hasSubmission}
                    submission={task.submission}
                />
            ))}
        </div>
    );
}