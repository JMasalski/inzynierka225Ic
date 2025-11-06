"use client"

import React, {useState} from "react"


import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Code2, EyeOff, Eye, Loader2} from "lucide-react"

import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import {loginFormSchema} from "@/form_schemas/form_schemas";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useAuthStore} from "@/store/useAuthStore";
import {useRouter} from "next/navigation";


export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })
    const {login, loading} = useAuthStore()

    const handleLogin = async (values: z.infer<typeof loginFormSchema>) => {
        try {
            const user = await login(values);

            if (!user) {
                form.setError("root", {
                    type: "manual",
                    message: "Nie udało się zalogować. Spróbuj ponownie.",
                });
                return;
            }

            if (!user.hasOnboarded) {
                router.push("/onboarding");
            } else {
                router.push("/");
            }

        } catch (err: any) {
            console.log(err.response)

            const errorMessage =
                err?.response?.data?.message ||
                "Wystąpił nieoczekiwany błąd podczas logowania.";

            form.setError("root", {type: "manual", message: errorMessage});
        }
    };
    return (

            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Code2 className="w-8 h-8 text-white"/>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">CodeClass</CardTitle>
                    <CardDescription className="text-base">Platforma do nauki programowania</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLogin)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor="username">Login</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Login" {...field} required/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password">Hasło</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="••••" {...field}
                                                       type={showPassword ? "text" : "password"} required/>
                                                <Button type="button" variant="ghost"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-0 top-0 hover:bg-transparent hover:text-inherit cursor-pointer"
                                                >
                                                    {showPassword ? <EyeOff/> : <Eye/>}
                                                </Button>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {form.formState.errors.root && (

                                <p className="text-md text-red-500  text-center">
                                    {form.formState.errors.root.message}
                                </p>
                            )}
                            <Button className="w-full" type="submit"
                                    disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                        </>
                                    ) :
                                    ('Zaloguj')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
    )
}
