"use client"
import React, {useEffect} from 'react'
import {useParams} from "next/navigation";
import {useTaskStore} from "@/store/useTaskStore";
import Loader from "@/components/Loader";

const Page = () => {
    const params = useParams()
    const taskId = params.id as string;

    const{getIndividualTask,individualTask,loading} = useTaskStore()
    useEffect(() => {
        getIndividualTask(taskId)
    },[taskId])


    if (loading) return <Loader/>
    console.log(individualTask)

    return (
        <div>Page</div>
    )
}
export default Page
