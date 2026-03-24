import type { addStudentInput } from "../types/students.types";
import { api } from "./apiInstance.api";



export const fetchStudentsByClass = async (classNo: string, section = "A") => {
  const res = await api.get(`/student/${classNo}/${section}`);
  return res.data;
};

export const createNewStudent = async (studentPayload: addStudentInput) => {
  const res = await api.post("/student/", studentPayload);
  return res.data;
};

export const changeProfilePicAPI = async (url: string) => {
  const res = await api.post("/student/profile-pic", {
    url,
  });
  return res.data;
};
