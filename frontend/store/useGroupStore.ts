import {create} from "zustand"
import {axiosInstance} from "@/lib/axiosInstance";
import {toast} from "sonner";


export interface Student {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
}

export interface Group {
    id: string;
    name: string;
    students: Student[];
}

export type GroupTableItem = {
    id: string;
    name: string;
    createdAt: string;
    _count: {
        students: number;
    };
};

export type GroupTableResponse = {
    data: GroupTableItem[];
    total: number;
};

type GroupState = {
    loading: boolean;
    groups: GroupTableItem[];
    singleGroup: Group|null;
    total: number;

    fetchGroupsToTable: (params: {
        page: number;
        pageSize: number;
        sortField?: string;
        sortOrder?: "asc" | "desc";
        search?: string;
    }) => Promise<void>;

    updateGroupName: (groupId: string, data: { name: string }) => Promise<void>;

    addStudentsToGroup: (groupId: string, studentsIds: string[]) => Promise<void>;
    removeStudentFromGroup: (id: string[]) => Promise<void>;
    fetchSingleGroup: (id: string) => Promise<void>;
    deleteGroup: (ids:string[]) => Promise<void>;
};

export const useGroupStore = create<GroupState>((set,get) => ({
    loading: false,
    groups: [],
    singleGroup:null,
    total: 0,

    fetchGroupsToTable: async (params) => {
        try {

            set({ loading: true });

            const res = await axiosInstance.get<GroupTableResponse>("/api/v1/group", { params });

            set({
                groups: res.data.data,
                total: res.data.total
            });

        } catch (e) {
            console.error(e);
        } finally {
            set({ loading: false });
        }
    },

    fetchSingleGroup: async (id:string)=>{
        try{
            set({loading:true})
            const res = await axiosInstance.get(`/api/v1/group/${id}`)
            set({
                singleGroup:res.data,
            })
        }catch (e) {
            toast.error("Błąd poczas pobierania grupy")
            console.log("Błąd podczas pobierania grupy", e)
        }finally {
            set({ loading: false });
        }
    },

    updateGroupName: async (groupId, data) => {
        try {
            await axiosInstance.patch(`/api/v1/group/${groupId}`, data);
            toast.success("Nazwa grupy zmieniona pomyślnie")
        } catch (e) {
            console.error(e);
            toast.error("Wystąpił bład podczas zmiany nazwy grupy")

        }
    },

    addStudentsToGroup: async (groupId, studentsIds) => {
        try {
            const res = await axiosInstance.post(`/api/v1/group/${groupId}/add-students`, {
                studentsIds
            });
            console.log(res)
            toast.success(res.data.message);

            await get().fetchSingleGroup(groupId)
        } catch (e) {
            console.error(e);
        }
    },

    removeStudentFromGroup: async(ids:string[]) =>{
        try{
            await axiosInstance.post("api/v1/group/remove-students",{
                studentsIds: ids
            })

            set(state => ({
                singleGroup: state.singleGroup ? {
                    ...state.singleGroup,
                    students: state.singleGroup.students.filter(
                        student => !ids.includes(student.id)
                    )
                } : null
            }))

            toast.success("Użytkownik został usunięty z grupy")
        }catch (e) {
            console.log(e)
            toast.error("Podczas usuwania ucznia wystąpił błąd")
        }
    },
    deleteGroup : async(groupIds) =>{
        try {
            await axiosInstance.delete("/api/v1/group/delete-groupes",
                {data:
                        {groupIds}}
            );
            toast.success("Grupy zostały usunięte");

            await get().fetchGroupsToTable({
                page: 0,
                pageSize: 10,
            });
        }catch (e:any) {
            toast.error(
                e.response?.data?.message ||
                "Błąd podczas usuwania zadań"
            );
            console.error(e);

        }
    }


}));
