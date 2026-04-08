import { api } from "./apiInstance.api";

export const fetchTimeTableData = async (classNo: number) => {
    const res = await api.get(`/academic/timetable/${classNo}`);
    return res.data;
};



export const fetchSyllabus = async (
    classNo?: number
) => {

    const res = await api.get(`/academic/syllabus/${classNo}`);
    return res.data;
};