"use client"
import React from 'react'
import {useAuthStore} from "@/store/useAuthStore";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const Page = () => {
    const {authUser}= useAuthStore()
    console.log(authUser)

    return (
        <div>
            <Button onClick={()=>{toast.error("Zle haslo")}}>
                Klik
            </Button>
        </div>
    )
}
export default Page
