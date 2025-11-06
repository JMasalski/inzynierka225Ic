import React from 'react'
import {useAuthStore} from "@/store/useAuthStore";
import {ROLES} from "@/lib/roles";
import {Code2, LogOut, UserStar} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const Navbar = () => {
    const {authUser,logout} = useAuthStore()
    const router = useRouter()

    return (
        <header className="border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                    <div
                        className="size-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Code2 className="size-6 text-white"/>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">CodeClass </h1>
                        <p className="text-sm text-muted-foreground">{authUser?.firstName} {authUser?.lastName}  </p>
                    </div>
                </div>
                <nav className="flex items-center gap-3">
                    {authUser?.role === ROLES.TEACHER || authUser?.role === ROLES.ROOT && (
                        <Button variant="ghost" size="sm"  onClick={() => {router.push('/teacher-dashboard')}}>
                            Panel nauczyciela
                            <UserStar />
                        </Button>
                    )}


                    <Button variant="ghost" size="sm" onClick={logout}>
                        Wyloguj
                        <LogOut/>
                    </Button>
                </nav>
            </div>
        </header>
    )
}
export default Navbar
