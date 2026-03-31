import { api } from "./apiInstance.api"

export const fetchUtMarks = async (classNo:number) => {
    const res = await api.get(`/marks/ut/${classNo}`)
    return res.data;
}

export const fetchExamMarks = async (classNo:number) => {
    const res = await api.get(`/marks/exam/${classNo}`)
    return res.data;
}



