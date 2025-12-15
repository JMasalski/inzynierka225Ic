import React from 'react'
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import DataGridTask from "@/app/(protected)/teacher-dashboard/componentes/DataGrids/DataGridTask";


const ExercisesTab = () => {
    const router = useRouter()
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold  text-gray-900">
                    Lista zadań
                </h1>
                <Button onClick={() => router.push("teacher-dashboard/new-task")}>
                    <Plus className="w-4 h-4 mr-2"/>
                    Dodaj zadanie
                </Button>
            </div>
            <DataGridTask/>
        </div>
    );
}
export default ExercisesTab
