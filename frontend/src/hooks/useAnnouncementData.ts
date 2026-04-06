import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { fetchAnnouncement, postAnnouncement } from "../api/announcement.api";
import toast from "react-hot-toast";

export const useFetchAnnouncementData = (userData:userData) => {
    return useQuery({
        queryKey:['announcement',userData?.authId],
        queryFn:fetchAnnouncement,
        select:(res) => res.data,
        enabled:!!userData.authId,
        retry:false
    })
}

export const usePostAnnouncement = (userData:userData) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:postAnnouncement,
        onSuccess:(res) => {
            queryClient.setQueryData(['announcement',userData?.authId],res.data)
            toast.success('added announcement')
        },
        onError:(err) => {
            toast.error(err?.message)
        }
    })
}