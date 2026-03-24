import { api } from "./apiInstance.api";

export const fetchSchoolInfo = async () => {
  const res = await api.get("/api/data/school");
  return res.data;
};
