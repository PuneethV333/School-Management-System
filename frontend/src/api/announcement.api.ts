import { api } from "./apiInstance.api"

export const fetchAnnouncement = async () => {
    const res = await api.get("/announcement");
    return res.data
}

