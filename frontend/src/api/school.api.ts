import { api } from "./apiInstance.api";

export const fetchSchoolInfo = async () => {
  const res = await api.get("/school");
  return res.data;
};
