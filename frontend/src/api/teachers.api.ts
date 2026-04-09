import { api } from "./apiInstance.api"

export const fetchTeachersData = async () => {
    const res = await api.get('/teachers/');
    return res.data;
}

export const fetchTeacherById = async (id:string) => {
  const res = await api.get(`/teacher/${id}`);
  return res.data;
};

