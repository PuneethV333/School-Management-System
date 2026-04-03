import type { addUTPayload } from "../types/ut.types";
import { api } from "./apiInstance.api"

export const fetchUtMarks = async (classNo:number) => {
    const res = await api.get(`/marks/ut/${classNo}`)
    return res.data;
}

export const fetchUtMarksForStudents = async (classNo:number) => {
    const res = await api.get(`/marks/student/ut/${classNo}`)
    return res.data;
}

export const fetchExamMarks = async (classNo:number) => {
    const res = await api.get(`/marks/exam/${classNo}`)
    return res.data;
}

type AddUtMarksParams = {
  props: addUTPayload;
  classNo: number;
};

export const addUtMarks = async ({ props, classNo }: AddUtMarksParams) => {
  const res = await api.post(`/marks/ut/${classNo}`, props);
  return res.data;
};