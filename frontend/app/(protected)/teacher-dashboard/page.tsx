"use client"
import {ROLES} from "@/lib/roles";
import {useAuthStore} from "@/store/useAuthStore";
import {useRouter} from "next/navigation";
import {BookOpen, TrendingUp, Users} from "lucide-react";
import StatisticCard from "@/components/StatisticCard";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import ExercisesTab from "@/components/ExercisesTab";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import UsersTab from "@/components/UsersTab";

const Page = () => {
    const {authUser} = useAuthStore()
    const router = useRouter()
    if (authUser?.role !== ROLES.TEACHER && authUser?.role !== ROLES.ROOT) {
        router.replace("/home")
        return null;
    }


    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatisticCard icon={Users} title={"Liczba uczniów"} value={"21"}/>
                <StatisticCard icon={BookOpen} title={"Zadania"} subtitle={"Dostępnych zadań"} value={"4"}/>
                <StatisticCard icon={TrendingUp} title={"Średnia ukończenia"} subtitle={"Wszystkich zadań"}
                               value={"5%"}/>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-bold">Zarządzanie platformą</CardTitle>
                    <CardDescription className="text-sm font-medium">Dodawaj uczniów, twórz zadania i monitoruj
                        postępy</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="usersTab" className="gap-12">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="usersTab">Użytkownicy</TabsTrigger>
                            <TabsTrigger value="exercisesTab">Zadania</TabsTrigger>
                        </TabsList>
                        <TabsContent value="usersTab" className="space-y-6">
                            <UsersTab/>
                        </TabsContent>
                        <TabsContent value="exercisesTab">
                            <ExercisesTab/>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
export default Page





