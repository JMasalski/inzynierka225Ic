"use client";

import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridSortModel} from "@mui/x-data-grid";
import {Search, Eye} from "lucide-react";
import {Input} from "@/components/ui/input";
import ConfirmDeleteDialog from "@/app/(protected)/teacher-dashboard/componentes/ConfirmDeleteDialog";
import {useTaskStore} from "@/store/useTaskStore";
import {useRouter} from "next/navigation";
import useDebounce from "@/lib/useDebounce";
import {Task} from "@/app/(protected)/teacher-dashboard/new-task/page";
import {Switch} from "@mui/material";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";


const DataGridTasks = () => {
    const router = useRouter();

    const {
        loading,
        getAllTasks,
        tasks,
        total,
        toggleTaskStatus,
        deleteTasks,

    } = useTaskStore();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
        type: "include",
        ids: new Set(),
    });

    const debounceSearch = useDebounce(search, 1000);

    useEffect(() => {
        getAllTasks({
            page,
            pageSize,
            search: debounceSearch,
            sortField: sortModel[0]?.field,
            sortOrder: sortModel[0]?.sort || undefined,
        });
    }, [page, pageSize, debounceSearch, sortModel]);

    const columns: GridColDef<Task>[] = [
        {
            field: "title",
            headerName: "Tytuł",
            width: 250,
        },
        {
            field: "description",
            headerName: "Opis",
            width: 350,
            sortable: false,
            renderCell: (params) =>
                params.value.length > 120
                    ? `${params.value.slice(0, 120)}...`
                    : params.value,
        },
        {
            field: "createdBy",
            headerName: "Autor",
            width: 200,
            sortable: false,
            renderCell: (params) => {
                const author = params.value;
                if (!author) return "—";

                const first = author.firstName ?? "";
                const last = author.lastName ?? "";

                return (first || last)
                    ? `${first} ${last}`.trim()
                    : author.username ?? "—";
            },
        },
        {
            field: "groups",
            headerName: "Ilość przypisanych grup",
            width: 120,
            sortable: false,
            renderCell: (params) => params.value?.length ?? 0,
        },
        {
            field: "isActive",
            headerName: "Status",
            width: 140,
            sortable: false,
            renderCell: (params) => {
                const {id, value} = params;

                return (
                    <Switch
                        checked={value}
                        onChange={async (e) => {
                            try {
                                await toggleTaskStatus(
                                    id as string,
                                    e.target.checked
                                );
                            } catch {
                                toast.error("Nie udało sie aktywować zadania")
                            }
                        }}
                        color="success"
                    />
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Utworzono",
            width: 180,
            valueGetter: (value) =>
                new Date(value).toLocaleDateString("pl-PL"),
        },
        {
            field: "actions",
            headerName: "Akcje",
            type: "actions",
            width: 120,
            getActions: (params) => [
                <Button
                    key="view"
                    onClick={() => router.push(`/teacher-dashboard/tasks/${params.id}`)}
                    variant="ghost"
                >
                    <Eye className="h-4 w-4"/>
                </Button>,
                <ConfirmDeleteDialog
                    key="delete"
                    title="Usuń zadanie"
                    description="Czy na pewno chcesz usunąć to zadanie? Ta akcja jest nieodwracalna."
                    onConfirmDelete={() =>
                        deleteTasks([params.id as string])
                    }
                    idsToDelete={[params.id]}
                />,
            ],
        },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Szukaj zadań..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {selectionModel.ids.size > 0 && (
                    <ConfirmDeleteDialog
                        title="Usuń zadania"
                        triggerLabel={`Usuń ${selectionModel.ids.size} zadań`}
                        description={`Czy na pewno chcesz usunąć ${selectionModel.ids.size} zadań?`}
                        onConfirmDelete={() =>
                            deleteTasks(
                                Array.from(selectionModel.ids.values()) as string[]
                            )
                        }
                        idsToDelete={Array.from(selectionModel.ids.values())}
                    />
                )}
            </div>

            <div style={{height: 500, width: '100%'}}>

                <DataGrid<Task>
                    rows={tasks}
                    columns={columns}
                    loading={loading}
                    checkboxSelection
                    getRowId={(row) => row.id!}
                    sortingMode="server"
                    pagination
                    paginationMode="server"
                    rowSelectionModel={selectionModel}
                    onRowSelectionModelChange={setSelectionModel}
                    rowCount={total}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    onSortModelChange={setSortModel}
                    paginationModel={{page, pageSize}}
                    keepNonExistentRowsSelected
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

export default DataGridTasks;
