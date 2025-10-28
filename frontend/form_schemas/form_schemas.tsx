"use client"
import {z} from "zod"

export const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
})


export const onboardingFormSchema = z.object({
    firstName: z
        .string()
        .min(3, "Imię musi mieć minimum 3 znaki")
        .max(50, "Imię może mieć maksymalnie 50 znaków"),
    lastName: z
        .string()
        .min(3, "Nazwisko musi mieć minimum 3 znaki")
        .max(50, "Nazwisko może mieć maksymalnie 50 znaków"),
    password: z
        .string()
        .min(8, "Hasło musi mieć minimum 8 znaków")
        .max(50, "Hasło może mieć maksymalnie 50 znaków")
        .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
        .regex(/[a-z]/, "Hasło musi zawierać małą literę")
        .regex(/[0-9]/, "Hasło musi zawierać cyfrę"),
    confirmPassword: z
        .string()
        .min(1, "Potwierdź hasło"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
});

export const onboardingApiSchema = onboardingFormSchema.omit({
    confirmPassword: true
});