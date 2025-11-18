import React, {useState} from 'react'
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import AddUsersModal from "@/app/(protected)/teacher-dashboard/componentes/AddUsersModal";
import DataGridUsers from "@/app/(protected)/teacher-dashboard/componentes/DataGrids/DataGridUsers";



const UsersTab = () => {
    const [open, setOpen] = useState(false)
    return (<>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold  text-gray-900">
                    Lista użytkowników
                </h1>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj
                </Button>
            </div>
            <DataGridUsers/>
        </div>
            <AddUsersModal open={open} onOpenChange={setOpen}/>
        </>

    );
}
export default UsersTab
