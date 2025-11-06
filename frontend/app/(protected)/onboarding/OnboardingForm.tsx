"use client"
import React, {useState} from 'react'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Eye, EyeOff, Check, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {onboardingFormSchema} from "@/form_schemas/form_schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuthStore} from "@/store/useAuthStore";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

interface PasswordRequirement {
    label: string;
    met: boolean;
}

const validatePasswordRequirements = (password: string): PasswordRequirement[] => {
    return [
        {
            label: "Co najmniej 8 znaków",
            met: password.length >= 8,
        },
        {
            label: "Zawiera wielką literę (A-Z)",
            met: /[A-Z]/.test(password),
        },
        {
            label: "Zawiera małą literę (a-z)",
            met: /[a-z]/.test(password),
        },
        {
            label: "Zawiera cyfrę (0-9)",
            met: /[0-9]/.test(password),
        },
        {
            label: "Zawiera znak specjalny (!@#$%...)",
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];
};

const OnboardingForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>(
        validatePasswordRequirements("")
    );
    const {completeOnboarding} = useAuthStore()
    const router = useRouter();

    const form = useForm<z.infer<typeof onboardingFormSchema>>({
        resolver: zodResolver(onboardingFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange"
    });

    const password = form.watch("password", "");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPasswordRequirements(validatePasswordRequirements(newPassword));
    };

    const handleSubmit = async (values: z.infer<typeof onboardingFormSchema>) => {
        try {
            const { confirmPassword, ...apiData } = values;
            const updatedUser =await  completeOnboarding(apiData);
            if (!updatedUser?.hasOnboarded) {
                toast.error("Nie udało się ukończyć onboardingu.");
                return;
            }
            router.push("/home");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Wystąpił błąd podczas zapisywania";
            toast.error(message);        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel htmlFor="firstName">Imię</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jan" {...field} />
                                </FormControl>
                                <div className="min-h-[20px]">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel htmlFor="lastName">Nazwisko</FormLabel>
                                <FormControl>
                                    <Input placeholder="Kowalski" {...field} />
                                </FormControl>
                                <div className="min-h-[20px]">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel htmlFor="password">Hasło</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="••••••••"
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handlePasswordChange(e);
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </FormControl>

                            {password.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {passwordRequirements.map((requirement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            {requirement.met ? (
                                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            )}
                                            <span
                                                className={
                                                    requirement.met
                                                        ? "text-green-600 font-medium"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {requirement.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="min-h-[20px]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel htmlFor="confirmPassword">Powtórz hasło</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="••••••••"
                                        {...field}
                                        type={showConfirmPassword ? "text" : "password"}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <div className="min-h-[20px]">
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                {form.formState.errors.root && (
                    <p className="text-red-500 text-center text-sm">
                        {form.formState.errors.root.message}
                    </p>
                )}
                <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Zapisywanie..." : "Zakończ konfigurację"}
                </Button>

            </form>
        </Form>
    )
}

export default OnboardingForm