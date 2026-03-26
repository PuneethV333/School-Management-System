import { useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { fetchSyllabus, fetchTimeTableData } from "../api/academic.api";
import type { subject } from "../types/academic.types";

export const useFetchTimeTable = (userData: userData, classNo: number) => {
  return useQuery({
    queryKey: ["timetable", classNo],
    queryFn: () => fetchTimeTableData(classNo),
    select: (res) => res.data,
    enabled: !!userData.authId && classNo > 0 && classNo <= 10,
    retry: false,
  });
};

export const useFetchSyllabus = (userData:userData,subject:subject) => {
    return useQuery({
        queryKey:['syllabus',subject],
        queryFn:() => fetchSyllabus(subject),
        select: (res) => res.data,
        enabled:!!userData.authId,
        retry:false,
    })
}