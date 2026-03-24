import { useQuery } from "@tanstack/react-query";
import { fetchSchoolInfo } from "../api/school.api";
import type { userData } from "../types/userData.types";

export const useSchoolData = (userData: userData) =>
  useQuery({
    queryKey: ["school", userData?.role],
    queryFn: fetchSchoolInfo,
    select: (res) => res.data,
    retry: false,
    enabled: !!userData?.role,
  });
