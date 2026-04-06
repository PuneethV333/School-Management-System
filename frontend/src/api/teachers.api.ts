import { api } from "./apiInstance.api"

export const fetchTeachersData = async () => {
    const res = await api.get('/teachers/');
    return res.data;
}

