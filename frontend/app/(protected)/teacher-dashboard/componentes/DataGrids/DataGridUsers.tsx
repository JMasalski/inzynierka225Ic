import React, {useEffect, useState} from 'react'
import {ChevronDown, Search, TrashIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {DataGrid, GridColDef, GridRowSelectionModel, GridSortModel} from "@mui/x-data-grid";
import {User, useUsersStore} from "@/store/useUsersStore";
import useDebounce from "@/lib/useDebounce";
import {useGroupStore} from "@/store/useGroupStore";
import {ROLES} from "@/lib/roles";
import ConfirmDeleteDialog from "@/app/(protected)/teacher-dashboard/componentes/ConfirmDeleteDialog";


const DataGridUsers = () => {

    const {loading, getAllUsers, users, total, deleteUsers} = useUsersStore()
    const {fetchGroupesToTable, groups, addStudentsToGroup} = useGroupStore()

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
        fetchGroupesToTable({
            page: 0,
            pageSize: 100,
        });
    }, []);


    useEffect(() => {
        getAllUsers({
            page,
            pageSize,
            search: debounceSearch,
            sortField: sortModel[0]?.field,
            sortOrder: sortModel[0]?.sort || undefined
        });
    }, [page, pageSize, debounceSearch, sortModel]);

    const handleProcessRowUpdate = async (newRow: User) => {
        try {
            const newGroupId = newRow.group?.id;
            console.log(newGroupId, newRow.id, newRow.firstName)

            if (newGroupId) {
                await addStudentsToGroup(newGroupId, [newRow.id]);
            }

            return newRow;
        } catch (error) {
            console.error("Błąd aktualizacji:", error);
            throw error;
        }
    };


    const columns: GridColDef<User>[] = [
        {
            field: 'name',
            headerName: 'Imię i nazwisko',
            width: 300,
            renderCell: (params) => {
                const first = params.row.firstName ?? "";
                const last = params.row.lastName ?? "";
                if (first === "" || last === "") {
                    return "Brak"
                }
                return `${first} ${last}`.trim();
            },
        },
        {
            field: "username",
            headerName: "Numer indeksu",
            width: 300,
        },
        {
            field: 'role',
            headerName: 'Rola',
            width: 150,
            renderCell: (params) => {
                return (params.row.role === ROLES.STUDENT) ? "Student" : (params.row.role === ROLES.TEACHER) ? "Nauczyciel" : ""
            }

        },
        {
            field: 'group',
            headerName: 'Grupa',
            width: 250,
            sortable: false,
            editable: true,
            type: "singleSelect",
            valueOptions: [
                ...groups.map(group => ({
                    value: group.id,
                    label: group.name
                }))
            ],
            renderCell: (params) => {
                return (
                    <div className="flex justify-between  w-full items-center"
                         style={{width: '100%'}}>
                        <p>{params.row.group?.name ?? "Brak grupy"}</p>
                        <ChevronDown/>
                    </div>)
            },
            valueGetter: (value, row) => {
                return row?.group?.id ?? '';
            },
            valueSetter: (value, row) => {
                const selectedGroup = groups.find(g => g.id === value);
                return {...row, group: selectedGroup || null};
            }

        },
        {
            field: 'actions',
            headerName: 'Akcje',
            type: "actions",
            width: 80,
            getActions: (params) => {
                return [
                    <ConfirmDeleteDialog title={"Usuń użytkownika"}
                                         description={"Czy na pewno chcesz usunąć tego użytkownika? Ta akcja jest nieodwracalna."
                                         } onConfirmDelete={deleteUsers} idsToDelete={[params.id]}/>
                ];
            }

        }
    ]


    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between ">
                <div className="relative max-w-sm">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Szukaj użytkowników..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {selectionModel.ids.size > 0 && (
                        <ConfirmDeleteDialog title={"Usuń użytkowników"}
                                             triggerLabel={`Usuń ${selectionModel.ids.size} użytkowników`}
                                             description={`Czy na pewno chcesz usunąć ${selectionModel.ids.size} użytkowników? Ta akcja jest nieodwracalna.`}
                                             onConfirmDelete={deleteUsers}
                                             idsToDelete={Array.from(selectionModel.ids.values())}
                        />)}


                </div>
            </div>

            <div style={{height: 500, width: '100%'}}>
                <DataGrid<User>
                    rows={users}
                    columns={columns}
                    loading={loading}
                    checkboxSelection={true}
                    getRowId={(row) => row.id}
                    sortingMode="server"
                    pagination
                    paginationMode="server"
                    rowSelectionModel={selectionModel}
                    onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                    rowCount={total}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    onSortModelChange={(model) => {
                        if (model[0]?.field === "name") {
                            setSortModel([{field: "lastName", sort: model[0].sort}]);
                        } else {
                            setSortModel(model);
                        }
                    }}
                    paginationModel={{page, pageSize}}
                    keepNonExistentRowsSelected={true}
                    editMode="row"
                    processRowUpdate={handleProcessRowUpdate}
                    onProcessRowUpdateError={(error) => {
                        console.error("Błąd podczas zapisywania:", error);
                    }}
                    sx={{
                        "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                            display: "none",
                        },
                    }}
                />
            </div>
        </div>
    );
}
export default DataGridUsers




