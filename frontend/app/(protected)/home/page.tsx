"use client"
import React from 'react'
import {useAuthStore} from "@/store/useAuthStore";

const Page = () => {
    const {authUser}= useAuthStore()
    console.log(authUser)

    return (
        <div>home page</div>
    )
}
export default Page
