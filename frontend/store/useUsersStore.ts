import {create} from "zustand"
import {axiosInstance} from "@/lib/axiosInstance";
import {z} from "zod";
import { usersFormSchema} from "@/form_schemas/form_schemas";
import {toast} from "sonner";


type UsersState = {
    loading: boolean
    addUsers: (data: z.infer<typeof usersFormSchema>) => Promise<void>
}
export const useUsersStore = create<UsersState>((set) => ({

    loading: false,
    addUsers: async (clientData :z.infer<typeof usersFormSchema>) => {
        try {
            set({loading: true})
            const res = await axiosInstance.post("/api/v1/auth/create-user", clientData)
            console.log(res)

            toast.success(res.data.message)
        } catch (e:any) {
            console.log(e.response.data.message);
            toast.error(e.response?.data?.message || "Wystąpił błąd podczas dodawania użytkowników");
        } finally {
            set({loading: false})
        }
    },
}))