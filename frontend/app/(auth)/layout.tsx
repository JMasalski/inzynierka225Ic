"use client";

import {useEffect} from "react";
import {useRouter, usePathname} from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";

export default function AuthLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();
    const {authUser, checkingAuth, checkAuth} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (checkingAuth) return;

        if (pathname === "/onboarding") {
            if (!authUser) {
                router.replace("/signin");
                return;
            }
            if (authUser.hasOnboarded) {
                router.replace("/home");
                return;
            }
        }

        if (pathname === "/signin" && authUser) {
            if (authUser.hasOnboarded) {
                router.replace("/home");
            } else {
                router.replace("/onboarding");
            }
        }
    }, [authUser, checkingAuth, pathname, router]);

    if (pathname === "/onboarding" && checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Sprawdzanie autoryzacji...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {children}
        </div>
    );
}