import { useQuery } from "@tanstack/react-query";
import { fetchSchoolInfo } from "../api/school.api";

export const useSchoolData = (userData:object)  => useQuery({
    queryKey:["school"],
    queryFn:fetchSchoolInfo,
    select:(res) => (res.data),
    retry:false,
    enabled:!!userData
})