import { useQuery } from "@tanstack/react-query";
import type { userData } from "../types/userData.types";
import {
  fetchClassAttendance,
  fetchMyAttendance,
  fetchStudentsAttendance,
  fetchStudentsAttendanceAccClass,
} from "../api/attendance.api";

export const useFetchMyAttendance = (userData?: userData) => {
  return useQuery({
    queryKey: ["attendance", "my", userData?.authId],
    queryFn: () => fetchMyAttendance(),
    enabled: !!userData?.authId,
    retry: false,
    select: (res) => res.data,
  });
};

export const useFetchStudentsAttendance = (userData?: userData) => {
  return useQuery({
    queryKey: ["attendance", "students", userData?.authId],
    queryFn: () => fetchStudentsAttendance(),
    enabled: !!userData?.authId && userData.role !== "student",
    retry: false,
    select: (res) => res.data,
  });
};

export const useFetchTeachersAttendance = (userData?: userData) => {
  return useQuery({
    queryKey: ["attendance", "teacher", userData?.authId],
    queryFn: () => fetchStudentsAttendance(),
    enabled: !!userData?.authId && userData.role === "authority",
    retry: false,
    select: (res) => res.data,
  });
};

export const useFetchClassAttendance = (
  userData?: userData,
  classNo?: number,
) => {
  return useQuery({
    queryKey: ["attendance", "class", classNo],
    queryFn: () => fetchClassAttendance(classNo!),
    enabled: !!userData?.authId && !!classNo,
    retry: false,
    select: (res) => res.data,
  });
};

export const useFetchStudentsAttendanceAccClass = (
  userData?: userData,
  classNo?: number,
) => {
  return useQuery({
    queryKey: ["attendance", "students", classNo],
    queryFn: () => fetchStudentsAttendanceAccClass(classNo!),
    enabled: !!userData?.authId && userData.role !== "student" && !!classNo,
    retry: false,
    select: (res) => res.data,
  });
};
