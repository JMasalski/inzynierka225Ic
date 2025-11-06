import React from 'react'
import {LucideIcon} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface StatisticCardProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    value: string;
}

const StatisticCard = ({ icon: Icon, title,subtitle,value }: StatisticCardProps) => {
    return (

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </CardContent>
        </Card>
    )
}
export default StatisticCard
