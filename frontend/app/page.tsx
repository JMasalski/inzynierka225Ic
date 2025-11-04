"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

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

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Ładowanie...</p>
            </div>
        </div>
    );
}