"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedLayout({
                                            children
                                        }: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { checkingAuth, authUser, checkAuth } = useAuthStore();
    const hasCheckedAuth = useRef(false);

    useEffect(() => {
        if (!hasCheckedAuth.current) {
            checkAuth();
            hasCheckedAuth.current = true;
        }
    }, [checkAuth]);

    useEffect(() => {
        if (checkingAuth) return;

        if (!authUser) {
            router.replace("/signin");
            return;
        }

        if (!authUser.hasOnboarded && pathname !== "/onboarding") {
            router.replace("/onboarding");
            return;
        }

        if (authUser.hasOnboarded && pathname === "/onboarding") {
            router.replace("/home");
            return;
        }
    }, [authUser, checkingAuth, pathname, router]);

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Sprawdzanie autoryzacji...</p>
                </div>
            </div>
        );
    }

    if (!authUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Przekierowywanie...</p>
            </div>
        );
    }

    return <>{children}</>;
}