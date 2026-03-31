import { useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { fetchUtMarks } from "../api/marks.api";

export const useFetchUtMarks = (classNo:number,userData:userData) => {
    return useQuery({
        queryKey:['ut',classNo,userData.authId],
        queryFn:() => fetchUtMarks(classNo),
        select:(res) => res.data,
        enabled:!!userData.authId && classNo > 0 && classNo <= 10,
        retry:false,
        staleTime:1000 * 60 * 5
    })
}

export const useFetchExamMarks = (classNo:number,userData:userData) => {
    return useQuery({
        queryKey:['ut',classNo,userData.authId],
        queryFn:() => fetchUtMarks(classNo),
        select:(res) => res.data,
        enabled:!!userData.authId && classNo > 0 && classNo <= 10,
        retry:false,
        staleTime:1000 * 60 * 5
    })
}