import { useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { fetchTeacherById, fetchTeachersData } from "../api/teachers.api";

export const useFetchAllTeachersData = (userData: userData) => {
    return useQuery({
        queryKey: ["all", "teachers", userData?.authId],
        queryFn: fetchTeachersData,
        select: (res) => res.data,
        enabled: !!userData && userData.role !== "student",
        retry: false,
    });
};

export const useFetchTeacherById = (userData: userData, id: string) => {
    return useQuery({
        queryKey: ['teacher', id, userData?.authId],
        queryFn: () => fetchTeacherById(id),
        retry: false,
        select: (res) => res.data,
        enabled: !!userData
    })
}