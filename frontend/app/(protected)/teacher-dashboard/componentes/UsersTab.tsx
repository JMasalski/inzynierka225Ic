import React, {useState} from 'react'
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import AddUsersModal from "@/app/(protected)/teacher-dashboard/componentes/AddUsersModal";

const rows: GridRowsProp = [
    {id: 1, name: 'Data Grid', description: 'the Community version'},
    {id: 2, name: 'Data Grid Pro', description: 'the Pro version'},
    {id: 3, name: 'Data Grid Premium', description: 'the Premium version'},
];

const columns: GridColDef[] = [
    {field: 'name', headerName: 'Product Name', width: 200, editable: true},
    {field: 'description', headerName: 'Description', width: 300, editable: true},
];

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
            <div style={{height: 300, width: '100%'}}>
                <DataGrid rows={rows} columns={columns}/>
            </div>
        </div>
            <AddUsersModal open={open} onOpenChange={setOpen}/>
        </>

    );
}
export default UsersTab
