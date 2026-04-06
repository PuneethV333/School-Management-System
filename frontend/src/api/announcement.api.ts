import type { postAnnouncementInput } from "../types/announcement.types";
import { api } from "./apiInstance.api"

export const fetchAnnouncement = async () => {
    const res = await api.get("/announcement");
    return res.data
}

export const postAnnouncement = async (data:postAnnouncementInput) => {
    const res = await api.post('/announcement',data);
    return res.data
}
