"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import Loader from "@/components/Loader";

export default function ProtectedTeacherRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { loading,authUser } = useAuthStore();

    useEffect(() => {
        if (!loading) {
            if (!authUser || authUser.role !== "TEACHER") {
                router.replace("/");
            }
        }
    }, [authUser, loading]);

    if (loading || !authUser) return <Loader/>; // albo spinner

    return <>{children}</>;
}