import {create} from "zustand"
import {axiosInstance} from "@/lib/axiosInstance";

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
    total: number;

    fetchGroupesToTable: (params: {
        page: number;
        pageSize: number;
        sortField?: string;
        sortOrder?: "asc" | "desc";
        search?: string;
    }) => Promise<void>;

    updateGroupName: (groupId: string, data: { name: string }) => Promise<void>;

    addStudentsToGroup: (groupId: string, studentsIds: string[]) => Promise<void>;
};

export const useGroupStore = create<GroupState>((set) => ({
    loading: false,
    groups: [],
    total: 0,

    fetchGroupesToTable: async (params) => {
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

    updateGroupName: async (groupId, data) => {
        try {
            await axiosInstance.patch(`/api/v1/group/${groupId}`, data);
        } catch (e) {
            console.error(e);
        }
    },

    addStudentsToGroup: async (groupId, studentsIds) => {
        try {
            const res = await axiosInstance.post(`/api/v1/group/${groupId}/add-students`, {
                studentsIds
            });
            console.log(res)

        } catch (e) {
            console.error(e);
        }
    },
}));
