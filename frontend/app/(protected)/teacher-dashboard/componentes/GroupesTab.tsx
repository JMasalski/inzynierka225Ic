import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import DataGridGroupes from "@/app/(protected)/teacher-dashboard/componentes/DataGrids/DataGridGroupes";
import {useState} from "react";
import {AddGroupDialog} from "@/app/(protected)/teacher-dashboard/componentes/AddGroupModal";


const GroupesTab = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold  text-gray-900">
                    Lista grup
                </h1>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="w-4 h-4 mr-2"/>
                    Dodaj grupę
                </Button>
            </div>
            <DataGridGroupes/>
            <AddGroupDialog open={open} onOpenChange={setOpen} />
        </div>
    );
}
export default GroupesTab
