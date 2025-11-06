import {create} from "zustand"
import {axiosInstance} from "@/lib/axiosInstance";
import {z} from "zod";
import {loginFormSchema, onboardingApiSchema} from "@/form_schemas/form_schemas";
import {toast} from "sonner";

interface User {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    hasOnboarded: boolean,
    role: string
}

type AuthState = {
    authUser: User | null,
    checkingAuth: boolean,
    loading: boolean,
    login: (data: z.infer<typeof loginFormSchema>) => Promise<User | null>,
    completeOnboarding: (data: z.infer<typeof onboardingApiSchema>) => Promise<User | null>,
    checkAuth: () => Promise<void>,
    logout: () => Promise<void>,
}
export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    //TODO POCZYSCIC TUTAJ
    login: async (loginData: z.infer<typeof loginFormSchema>) => {
        try {
            set({loading: true});
            const res = await axiosInstance.post("api/v1/auth/login", loginData)
            const user = res.data.user
            set({authUser: user})
            return user
        } catch (error: any) {
            throw error
        } finally {
            set({loading: false})
        }
    },
    checkAuth: async () => {
        console.log("checkAuth start")
        try {
            const res = await axiosInstance.get("/api/v1/auth/auth-user", { withCredentials: true });
            console.log("checkAuth success", res.data);
            set({ authUser: res.data.user });
        } catch (err: any) {
            console.error("checkAuth error:", err.response?.data || err.message);
            set({ authUser: null });
        } finally {
            console.log("checkAuth finished");
            set({ checkingAuth: false });
        }
    },

    completeOnboarding: async (onboardingData) => {
        const res = await axiosInstance.patch("api/v1/onboarding/complete-onboarding", onboardingData);
        const user = res.data?.user;
        if (!user) throw new Error(res.data?.message || "Błąd onboardingu");
        set({authUser: user});
        return user;
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("api/v1/auth/logout");
            if (res.status === 200) {
                set({authUser: null});
                toast.success("Wylogowano pomyślnie");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Wystąpił błąd podczas wylogowania");
            throw error;
        }
    },
}))