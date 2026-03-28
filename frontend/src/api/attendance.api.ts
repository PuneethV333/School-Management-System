import { api } from "./apiInstance.api";

export const fetchMyAttendance = async () => {
  const res = await api.get("attendance/my");
  return res.data;
};

export const fetchClassAttendance = async (classNo: number) => {
  const res = await api.get(`/attendance/class/${classNo}`);
  return res.data;
};

export const fetchTeachersAttendance = async () => {
  const res = await api.get("/attendance/all/teacher");
  return res.data;
};

export const fetchStudentsAttendance = async () => {
  const res = await api.get("/attendance/all/student");
  return res.data;
};

export const fetchStudentsAttendanceAccClass = async (classNo:number) => {
  const res = await api.get(`/attendance/students/${classNo}`);
  return res.data;
};
