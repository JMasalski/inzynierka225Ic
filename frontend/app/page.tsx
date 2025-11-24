"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "@/components/Loader";

export default function HomePage() {
    const router = useRouter();
    const { authUser, checkingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!checkingAuth) {
            if (!authUser) {
                router.replace("/signin");
            } else if (!authUser.hasOnboarded) {
                router.replace("/onboarding");
            } else {
                router.replace("/home");
            }
        }
    }, [authUser, checkingAuth, router]);

    return <Loader/>

}