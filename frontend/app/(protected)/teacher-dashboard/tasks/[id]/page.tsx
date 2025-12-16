"use client";


import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Eye} from "lucide-react";
import {useParams} from "next/navigation";
import {useSubmissionStore} from "@/store/useSubmissionStore";
import SubmissionPreviewModal from "@/app/(protected)/teacher-dashboard/tasks/components/SubmissionPreviewModal";
import ProtectedTeacherRoute from "@/app/(protected)/teacher-dashboard/ProtectedTeacherRoute";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {useGroupStore} from "@/store/useGroupStore";
import {useTaskStore} from "@/store/useTaskStore";


const Page = () => {
    const {id: taskId} = useParams();
    const {submissions, getSubmissionsForTask, loading} = useSubmissionStore();
    const { groups, fetchGroupsToTable } = useGroupStore();
    const {assignedGroups, getAssignedGroups,updateAssignedGroups, getIndividualTask,individualTask} = useTaskStore()

    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [activeSubmission, setActiveSubmission] = useState<any>(null);

    useEffect(() => {
        fetchGroupsToTable({page: 0, pageSize: 1000})
    }, []);

    useEffect(() => {
        getIndividualTask(taskId as string);
    }, [taskId]);
    useEffect(() => {
        getAssignedGroups(taskId as string);
    }, [taskId, getAssignedGroups]);

    useEffect(() => {
        setSelectedGroupIds(
            assignedGroups.map(g => g.id)
        );
    }, [assignedGroups]);

    useEffect(() => {
        getSubmissionsForTask(taskId as string);
    }, [taskId, getSubmissionsForTask]);

    const toggleGroup = (groupId: string) => {
        setSelectedGroupIds(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const columns: GridColDef[] = [
        {
            field: "student",
            headerName: "Student",
            width: 220,
            valueGetter: (_, row) =>
                `${row.user.firstName ?? ""} ${row.user.lastName ?? ""}`.trim() || row.user.username,
        },
        {
            field: "index",
            headerName: "Indeks studenta",
            width: 220,
            valueGetter: (_, row) =>
                `${row.user.username}`
        },
        {
            field: "group",
            headerName: "Grupa",
            width: 220,
            valueGetter: (_, row) =>
                `${row.user.group.name}`
        },
        {
            field: "score",
            headerName: "Wynik",
            width: 120,
            renderCell: (p) => `${p.value ?? 0}%`,
        },
        {
            field: "status",
            headerName: "Status",
            width: 140,
            renderCell: (params) => {
                const value = params.value;

                let bgColor = "bg-gray-200 text-gray-800";
                if (value === "PASSED") bgColor = "bg-green-100 text-green-800";
                if (value === "FAILED") bgColor = "bg-red-100 text-red-800";
                return (
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${bgColor}`}>
            {value}
        </span>
                );
            }
        },
        {
            field: "createdAt",
            headerName: "Data",
            width: 180,
            valueGetter: (v) => new Date(v).toLocaleString("pl-PL"),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Akcje",
            width: 100,
            getActions: (params) => [
                <Button
                    key="preview"
                    className="flex items-center gap-1"
                    onClick={() => {
                        setActiveSubmission(params.row);
                        setOpen(true);
                    }}
                >
                    <Eye className="h-4 w-4"/> Podgląd
                </Button>,
            ],
        },
    ];


    return (
        <ProtectedTeacherRoute>
            <div className="w-full flex justify-center">
                <Card className="shadow-custom mb-8 p-10">
                    <CardHeader className="gap-y-12">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Zarządzanie zadaniem: {individualTask?.title}</CardTitle>
                            </div>

                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
                            <div className="space-y-2">
                                <CardTitle>Rozwiązania uczniów</CardTitle>
                                <CardDescription>Sprawdź odpowiedzi</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        Przydziel grupy ({selectedGroupIds.length})
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Przydziel grupy</DialogTitle>
                                        <DialogDescription>
                                            Zaznacz grupy, którym chcesz przypisać to zadanie.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y">
                                        {groups.length === 0 ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                Brak dostępnych grup
                                            </div>
                                        ) : (
                                            groups.map((group) => (
                                                <div
                                                    key={group.id}
                                                    className="flex items-center gap-3 p-3 hover:bg-muted/40 cursor-pointer"
                                                    onClick={() => toggleGroup(group.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedGroupIds.includes(group.id)}
                                                    />
                                                    <span className="font-medium">{group.name}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setSelectedGroupIds([])}
                                        >
                                            Odznacz wszystkie
                                        </Button>

                                        <DialogClose asChild>
                                            <Button
                                                onClick={async () => {
                                                    await updateAssignedGroups(
                                                        taskId as string,
                                                        selectedGroupIds
                                                    );
                                                }}
                                            >
                                                Zapisz ({selectedGroupIds.length})
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        <div style={{height: 500}}>
                            <DataGrid
                                rows={submissions}
                                columns={columns}
                                loading={loading}
                                getRowId={(row) => row.id}
                            />
                        </div>
                        <SubmissionPreviewModal
                            open={open}
                            onClose={() => setOpen(false)}
                            submission={activeSubmission}
                        />
                    </div>
                    </CardContent>
                </Card>

            </div>
        </ProtectedTeacherRoute>
    );

}
export default Page



