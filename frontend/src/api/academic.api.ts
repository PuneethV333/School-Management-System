import type { subject } from "../types/academic.types";
import { api } from "./apiInstance.api";

export const fetchTimeTableData = async (classNo:number) => {
  const res = await api.get(`/academic/timetable/${classNo}`);
  return res.data;
};



export const fetchSyllabus = async (subject:subject) => {
  const res = await api.get(`/academic/syllabus/${subject}`);
  return res.data;
};