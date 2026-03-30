import { useMutation } from "@tanstack/react-query";
import { markStudentAttendance } from "../api/attendance.api";
import toast from "react-hot-toast";

export const useMarkStudentsAttendance = () => {
  return useMutation({
    mutationFn: markStudentAttendance,
    onSuccess: () => {
      toast.success("attendance marked");
    },
    onError: () => {
      toast.error("failed to mark attendance");
    },
  });
};
