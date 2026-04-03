import { useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { fetchAnnouncement } from "../api/announcement.api";

export const useFetchAnnouncementData = (userData:userData) => {
    return useQuery({
        queryKey:['announcement',userData?.authId],
        queryFn:fetchAnnouncement,
        select:(res) => res.data,
        enabled:!!userData.authId,
        retry:false
    })
}