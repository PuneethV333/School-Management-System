import type { UseMutateFunction } from "@tanstack/react-query";
import type { addUtMarks, AddUtMarksParams } from "../api/marks.api";
import type { AxiosError } from "axios";
import type { incomingDataPayload } from "../types/ut.types";
import type { userData } from "../types/userData.types";
import type React from "react";

type AddUtMarksResponse = Awaited<ReturnType<typeof addUtMarks>>;

export const handleAddMarks = (
  mutate: UseMutateFunction<AddUtMarksResponse, AxiosError, AddUtMarksParams>,
  params: AddUtMarksParams,
) => {
  mutate(params);
};

export const subjects = [
  "MATH",
  "SCIENCE",
  "ENGLISH",
  "HINDI",
  "SOCIAL",
  "KANNADA",
];

export const getProgress = (
  filteredStudents: userData[],
  marks: incomingDataPayload[],
) => {
  if (filteredStudents.length === 0) return 0;
  return Math.round((marks.length / filteredStudents.length) * 100);
};

export const getStudentMark = (authId: string, marks: incomingDataPayload[]) =>
  marks.find((m) => m.authId === authId)?.marksObtained ?? "";

export const handleMarkChange = (
  student: userData,
  value: number,
  maxMarks: number,
  setMarks: React.Dispatch<React.SetStateAction<incomingDataPayload[]>>,
) => {
  const mark = Math.min(Math.max(value, 0), maxMarks);

  setMarks((prev) => {
    const idx = prev.findIndex((m) => m.authId === student.authId);

    if (idx !== -1) {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], marksObtained: mark };
      return updated;
    }

    return [...prev, { authId: student.authId, marksObtained: mark }];
  });
};
