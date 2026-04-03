import { useMutation, useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { addUtMarks, fetchExamMarks, fetchUtMarks, fetchUtMarksForStudents } from "../api/marks.api";
import toast from "react-hot-toast";

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

export const useFetchUtMarksForStudent = (classNo:number,userData:userData) => {
    return useQuery({
        queryKey:['ut','student',classNo,userData.authId],
        queryFn:() => fetchUtMarksForStudents(classNo),
        select:(res) => res.data,
        enabled:!!userData.authId && classNo > 0 && classNo <= 10,
        retry:false,
        staleTime:1000 * 60 * 5
    })
}

export const useFetchExamMarks = (classNo:number,userData:userData) => {
    return useQuery({
        queryKey:['exam',classNo,userData.authId],
        queryFn:() => fetchExamMarks(classNo),
        select:(res) => res.data,
        enabled:!!userData.authId && classNo > 0 && classNo <= 10,
        retry:false,
        staleTime:1000 * 60 * 5
    })
}

export const useAddUtMarks = () => {
  return useMutation({
    mutationFn: addUtMarks,
    onSuccess: () => {
      toast.success("attendance marked");
    },
    onError: () => {
      toast.error("failed to mark attendance");
    },
  });
};