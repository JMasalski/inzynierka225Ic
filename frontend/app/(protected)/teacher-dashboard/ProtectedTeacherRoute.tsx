"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import Loader from "@/components/Loader";
import {ROLES} from "@/lib/roles";

export default function ProtectedTeacherRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { loading,authUser } = useAuthStore();

    useEffect(() => {
        if (!loading) {
            if (!authUser || authUser.role !== ROLES.TEACHER && authUser.role !== ROLES.ROOT) {
                router.replace("/");
            }
        }
    }, [authUser, loading]);

    if (loading || !authUser) return <Loader/>; // albo spinner

    return <>{children}</>;
}