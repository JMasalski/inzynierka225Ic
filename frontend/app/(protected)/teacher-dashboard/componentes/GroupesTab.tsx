import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import DataGridGroupes from "@/app/(protected)/teacher-dashboard/componentes/DataGrids/DataGridGroupes";


const GroupesTab = () => {


    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold  text-gray-900">
                    Lista zadań
                </h1>
                <Button>
                    <Plus className="w-4 h-4 mr-2"/>
                    Dodaj zadanie
                </Button>
            </div>
            <DataGridGroupes/>
        </div>
    );
}
export default GroupesTab
