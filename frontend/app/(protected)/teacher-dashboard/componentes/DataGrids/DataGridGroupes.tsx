import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    GridColDef,
    GridSortModel,
    GridRowModesModel,
    GridEventListener,
    GridRowEditStopReasons, GridRowSelectionModel
} from "@mui/x-data-grid";
import {useGroupStore, GroupTableItem} from "@/store/useGroupStore";
import {EditIcon, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import useDebounce from "@/lib/useDebounce";

import ConfirmDeleteDialog from "@/app/(protected)/teacher-dashboard/componentes/ConfirmDeleteDialog";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const DataGridGroupes = () => {
    const {groups, total, loading, fetchGroupsToTable, updateGroupName,deleteGroup} = useGroupStore();
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [search, setSearch] = useState("");
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
        type: "include",
        ids: new Set(),
    });


    const debounceSearch = useDebounce(search, 1000);

    useEffect(() => {
        fetchGroupsToTable({
            page,
            pageSize,
            search: debounceSearch,
            sortField: sortModel[0]?.field,
            sortOrder: sortModel[0]?.sort || undefined,
        });
    }, [page, pageSize, sortModel, debounceSearch, fetchGroupsToTable]);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = async (newRow: GroupTableItem) => {
        try {
            await updateGroupName(newRow.id, {name: newRow.name});
            return newRow;
        } catch (error) {
            console.error('Błąd podczas aktualizacji:', error);
            throw error;
        }
    };

    const handleProcessRowUpdateError = (error: Error) => {
        console.error('Błąd edycji:', error);
    };

    const columns: GridColDef<GroupTableItem>[] = [
        {
            field: 'name',
            headerName: 'Nazwa grupy',
            width: 200,
            editable: true
        },

        {
            field: "studentsCount",
            headerName: "Liczba studentów",
            width: 180,
            sortable: false,
            valueGetter: (value, row) => row._count?.students ?? 0
        },

        {
            field: 'createdAt',
            headerName: 'Utworzona',
            width: 200,
            valueGetter: (value, row) =>
                new Date(row.createdAt).toLocaleString("pl-PL")
        },
        {
            field: 'actions',
            headerName: 'Akcje',
            type: "actions",
            width: 100,
            getActions: (params) => {
                return [
                    <ConfirmDeleteDialog title={"Usuń grupę"}
                                         description={"Czy na pewno chcesz usunąć tą grupę? Ta akcja jest nieodwracalna."}
                                         onConfirmDelete={() => deleteGroup([params.id as string])}
                                         idsToDelete={[params.id]}/>,
                    <Button variant={"ghost"} onClick={()=>router.push(`/teacher-dashboard/group/${params.id}`)}>
                        <EditIcon/>
                    </Button>
                ];
            }

        }
    ];


    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between ">
                <div className="relative max-w-sm">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Szukaj grup..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {selectionModel.ids.size > 0 && (
                        <ConfirmDeleteDialog title={"Usuń grupy"}
                                             triggerLabel={`Usuń ${selectionModel.ids.size} grup`}
                                             description={`Czy na pewno chcesz usunąć ${selectionModel.ids.size} grup? Ta akcja jest nieodwracalna.`}
                                             onConfirmDelete={() =>
                                                 deleteGroup(
                                                     Array.from(selectionModel.ids).map(String)
                                                 )
                                             }
                                             idsToDelete={Array.from(selectionModel.ids.values())}
                        />)}


                </div>

            </div>

            <div style={{height: 500, width: '100%'}}>
                <DataGrid<GroupTableItem>
                    rows={groups}
                    columns={columns}
                    loading={loading}
                    checkboxSelection={true}
                    getRowId={(row) => row.id}
                    sortingMode="server"
                    onSortModelChange={setSortModel}
                    pagination
                    paginationMode="server"
                    rowSelectionModel={selectionModel}
                    onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                    rowCount={total}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    paginationModel={{page, pageSize}}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={setRowModesModel}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    sx={{
                        "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                            display: "none",
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default DataGridGroupes;