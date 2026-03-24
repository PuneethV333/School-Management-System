import { useQuery } from "@tanstack/react-query";
import { fetchSchoolInfo } from "../api/school.api";

type userData = {
    role?:'student'|'authority'|'teacher'
    name?:string
}

export const useSchoolData = (userData:userData)  => useQuery({
    queryKey:["school",userData],
    queryFn:fetchSchoolInfo,
    select:(res) => (res.data),
    retry:false,
    enabled:!!userData?.role
})