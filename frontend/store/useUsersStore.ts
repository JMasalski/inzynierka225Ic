import {create} from "zustand"
import {axiosInstance} from "@/lib/axiosInstance";
import {z} from "zod";
import {usersFormSchema} from "@/form_schemas/form_schemas";
import {toast} from "sonner";
import {ROLES} from "@/lib/roles";
import {GridRowId} from "@mui/x-data-grid";

export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: ROLES.STUDENT | ROLES.TEACHER;
    group: {
        name: string;
        id: string;
    } | null;
    username: string;
}

type UsersState = {
    loading: boolean
    addUsers: (data: z.infer<typeof usersFormSchema>) => Promise<void>
    users: User[];
    total: number;
    deleteUsers: (ids: GridRowId[]) => Promise<void>;
    getAllUsers: (params: {
                      page?: number,
                      pageSize?: number,
                      search?: string,
                      sortField?: string | null,
                      sortOrder?: "asc" | "desc" | null
                  }
    ) => Promise<void>;
    lastQueryParams: {
        page?: number,
        pageSize?: number,
        search?: string,
        sortField?: string | null,
        sortOrder?: "asc" | "desc" | null
    } | null;
}

export const useUsersStore = create<UsersState>((set, get) => ({

    loading: false,
    users: [],
    total: 0,
    lastQueryParams: null,

    getAllUsers: async (params) => {
        set({loading: true, lastQueryParams: params});

        try {
            const res = await axiosInstance.get("api/v1/users", {
                params
            });

            set({
                users: res.data.data,
                total: res.data.total,
            });

        } catch (err) {
            console.log(err)
            toast.error("Nie udało się pobrać użytkowników");
        } finally {
            set({loading: false});
        }
    },

    addUsers: async (clientData: z.infer<typeof usersFormSchema>) => {
        try {
            set({loading: true})
            const res = await axiosInstance.post("/api/v1/auth/create-user", clientData)
            toast.success(res.data.message)

            const {lastQueryParams, getAllUsers} = get();
            if (lastQueryParams) {
                await getAllUsers(lastQueryParams);
            }
        } catch (e: any) {
            console.log(e.response?.data?.message ?? e);
            toast.error(e.response?.data?.message || "Wystąpił błąd podczas dodawania użytkowników");
        } finally {
            set({loading: false})
        }
    },

    deleteUsers: async (ids: GridRowId[]) => {
        try {
            set({loading: true});

            const res = await axiosInstance.delete("/api/v1/users/delete", {
                data: {usersIds: ids}
            });

            toast.success(res.data.message);

            const {lastQueryParams, getAllUsers} = get();
            if (lastQueryParams) {
                await getAllUsers(lastQueryParams);
            }

        } catch (e: any) {
            console.log(e);
            toast.error(e.response?.data?.message || "Błąd podczas usuwania użytkowników");
        } finally {
            set({loading: false});
        }
    }

}))