"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import LoginForm from "@/app/signin/SiginForm";

export default function SignInPage() {
    const router = useRouter();
    const { authUser, checkingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!checkingAuth && authUser) {
            router.replace("/home");
        }
    }, [authUser, checkingAuth, router]);

    if (checkingAuth) return <div>Loading...</div>;

    return <LoginForm />;
}
