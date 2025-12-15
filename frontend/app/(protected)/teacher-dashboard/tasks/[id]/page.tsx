"use client";


import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Eye} from "lucide-react";
import {useParams} from "next/navigation";
import {useSubmissionStore} from "@/store/useSubmissionStore";
import SubmissionPreviewModal from "@/app/(protected)/teacher-dashboard/tasks/components/SubmissionPreviewModal";
import ProtectedTeacherRoute from "@/app/(protected)/teacher-dashboard/ProtectedTeacherRoute";


const Page = () => {
    const {id: taskId} = useParams();
    const {submissions, getSubmissionsForTask, loading} = useSubmissionStore();
    console.log(taskId)


    const [open, setOpen] = useState(false);
    const [activeSubmission, setActiveSubmission] = useState<any>(null);


    useEffect(() => {
        getSubmissionsForTask(taskId as string);
    }, [taskId]);


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
            headerName: "Indeks studneta",
            width: 220,
            valueGetter: (_, row) =>
                `${row.user.username}`
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
            width: 100,
            getActions: (params) => [
                <button
                    key="preview"
                    className="text-blue-600 flex items-center gap-1"
                    onClick={() => {
                        setActiveSubmission(params.row);
                        setOpen(true);
                    }}
                >
                    <Eye className="h-4 w-4"/> Podgląd
                </button>,
            ],
        },
    ];


    return (
        <ProtectedTeacherRoute>
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Rozwiązania studentów</h1>


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
        </ProtectedTeacherRoute>
    );

}
export default Page
