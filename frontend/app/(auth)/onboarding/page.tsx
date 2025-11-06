"use client"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckCircle} from "lucide-react";
import OnboardingForm from "@/app/(auth)/onboarding/OnboardingForm";


const Page = () => {
    return (

        <Card className="w-full max-w-xl shadow-lg">
            <CardHeader className="space-y-3 text-center">
                <div className="flex items-center justify-center">
                    <div className="size-12 bg-green-200 rounded-full flex items-center justify-center">
                        <CheckCircle/>
                    </div>
                </div>
                <CardTitle className="text-xl font-bold">
                    Witaj w CodeClasses!
                </CardTitle>
                <CardDescription className="text-md">
                    To twoje pierwsze logowanie. Podaj swoje imię i nazwisko oraz ustaw nowe hasło.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OnboardingForm/>
            </CardContent>
        </Card>
    )
}
export default Page
