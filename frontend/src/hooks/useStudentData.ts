import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import {
  changeProfilePicAPI,
  createNewStudent,
  fetchStudentsByClass,
} from "../api/students.api";
import toast from "react-hot-toast";

export const useFetchStudentsByClass = (
  userData: userData,
  classNo: number,
  section = "A",
) =>
  useQuery({
    queryKey: ["students", classNo, section],
    queryFn: () => fetchStudentsByClass(classNo, section),
    enabled: !!userData?.authId && !!classNo,
    retry: false,
    staleTime: 1000 * 60 * 5,
    select:(res) => res.data
  });

export const useCreateNewStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "students",
          variables.student.class,
          variables.student.section,
        ],
      });

      toast.success("Student added successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to add student");
    },
  });
};

export const useChangeProfilePic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => changeProfilePicAPI(url),
    onSuccess: (res) => {
      queryClient.setQueryData(["me"], res.data);
      toast.success("Profile pic changed successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to change profile pic");
    },
  });
};
