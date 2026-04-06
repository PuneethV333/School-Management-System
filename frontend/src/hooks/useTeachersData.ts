import { useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import { fetchTeachersData } from "../api/teachers.api";

export const useFetchAllTeachersData = (userData: userData) => {
  return useQuery({
    queryKey: ["all", "teachers", userData?.authId],
    queryFn: fetchTeachersData,
    select: (res) => res.data,
    enabled: !!userData && userData.role !== "student",
    retry: false,
  });
};
