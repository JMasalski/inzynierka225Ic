"use client"
import {ROLES} from "@/lib/roles";
import {useAuthStore} from "@/store/useAuthStore";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import ExercisesTab from "@/app/(protected)/teacher-dashboard/componentes/ExercisesTab";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import UsersTab from "@/app/(protected)/teacher-dashboard/componentes/UsersTab";
import GroupesTab from "@/app/(protected)/teacher-dashboard/componentes/GroupesTab";
import ProtectedTeacherRoute from "@/app/(protected)/teacher-dashboard/ProtectedTeacherRoute";

const Page = () => {
    const {authUser} = useAuthStore()
    const router = useRouter()
    if (authUser?.role !== ROLES.TEACHER && authUser?.role !== ROLES.ROOT) {
        router.replace("/home")
        return null;
    }

    const [activeTab, setActiveTab] = useState("usersTab");

    useEffect(() => {
        const storedTab = localStorage.getItem("activeTab");
        if (storedTab) setActiveTab(storedTab);
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        localStorage.setItem("activeTab", value);
    };



    return (
        <ProtectedTeacherRoute>
        <div>
            <Card className="shadow-custom">
                <CardHeader>
                    <CardTitle className="font-bold">Zarządzanie platformą</CardTitle>
                    <CardDescription className="text-sm font-medium">Dodawaj uczniów, twórz zadania i monitoruj
                        postępy</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-12">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="usersTab">Użytkownicy</TabsTrigger>
                            <TabsTrigger value="groupesTab">Grupy</TabsTrigger>
                            <TabsTrigger value="exercisesTab">Zadania</TabsTrigger>
                        </TabsList>
                        <TabsContent value="usersTab" className="space-y-6">
                            <UsersTab/>
                        </TabsContent>
                        <TabsContent value="groupesTab" className="space-y-6">
                            <GroupesTab/>
                        </TabsContent>
                        <TabsContent value="exercisesTab">
                            <ExercisesTab/>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        </ProtectedTeacherRoute>
    );
}
export default Page





