export interface incomingDataPayload {
  authId: string;
  marksObtained: number;
}

export interface addUTPayload {
  data: incomingDataPayload[];
  examDate: Date;
  subjectName: "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English";
  maxMarks: number;
  utNo: number;
}

export interface addExamPayload {
  data: incomingDataPayload[];
  examDate: Date;
  subjectName: "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English";
  maxMarks: number;
  type: "FA-1" | "FA-2" | "FA-3" | "FA-4" | "SA-1" | "SA-2";
}

import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import Student from "../models/student.module";
import Marks from "../models/marks.module";
import ExamTest from "../models/examtest.module";
import { getVal, setValKey } from "../utils/redis.utils";
import {
  addExamServices,
  addUtServices,
  validateData,
  validateData2,
} from "../services/marks.services";
import { redisClient } from "../config/redis";

export const getUTMarks = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const classNo = parseInt(req.params.classNo as string, 10);
    if (isNaN(classNo)) {
      return res.status(400).json({ message: "Invalid class number" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    const cacheKey =
      reqUser.role === "student"
        ? `UT:${classNo}:${academicYear}:${reqUser.authId}`
        : `UT:${classNo}:${academicYear}:${reqUser.role}`;

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    let data;

    if (reqUser.role === "student") {
      const student = await Student.findOne({
        authId: reqUser.authId,
        class:classNo,
      }).lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      data = await Marks.find({
        studentId: student._id,
        class:classNo,
        academicYear,
      }).lean();
    } else if (reqUser.role === "teacher" || reqUser.role === "authority") {
      data = await Marks.find({
        class:classNo,
        academicYear,
      }).lean();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    await setValKey(cacheKey, JSON.stringify(data), 3600);

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const getExamMarks = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const classNo = parseInt(req.params.classNo as string, 10);
    if (isNaN(classNo)) {
      return res.status(400).json({ message: "Invalid classNo" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    const cacheKey =
      reqUser.role === "student"
        ? `Exam:${classNo}:${academicYear}:${reqUser.authId}`
        : `Exam:${classNo}:${academicYear}:${reqUser.role}`;

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    let data;

    if (reqUser.role === "student") {
      const student = await Student.findOne({
        authId: reqUser.authId,
        classNo,
      }).lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      data = await ExamTest.find({
        studentId: student._id,
        classNo,
        academicYear,
        publishedAt: { $ne: null },
      }).lean();
    } else if (reqUser.role === "teacher" || reqUser.role === "authority") {
      data = await ExamTest.find({
        classNo,
        academicYear,
      }).lean();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    await setValKey(cacheKey, JSON.stringify(data), 3600);

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const addUTMarks = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (reqUser.role !== "teacher" && reqUser.role !== "authority") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const classNo = parseInt(req.params.classNo as string, 10);
    if (isNaN(classNo)) {
      return res.status(400).json({ message: "Invalid classNo" });
    }

    const payload: addUTPayload = req.body;
    if (!payload) {
      return res.status(400).json({ message: "Payload missing" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    validateData(payload);

    const result = await addUtServices(payload, classNo);

    const keys = [
      `UT:${classNo}:${academicYear}:student`,
      `UT:${classNo}:${academicYear}:teacher`,
      `UT:${classNo}:${academicYear}:authority`,
    ];

    await Promise.all(keys.map((key) => redisClient.del(key)));

    return res.status(200).json({
      success: true,
      data: result.updated,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const addExamMark = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;
    if (!reqUser) {
      return res.status(403).json({
        message: "unauthorized",
      });
    }

    if (reqUser.role !== "teacher" && reqUser.role !== "authority") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const classNo = parseInt(req.params.classNo as string, 10);
    if (isNaN(classNo)) {
      return res.status(400).json({
        message: "invalid class number",
      });
    }

    const payload: addExamPayload = req.body;
    if (!payload) {
      return res.status(400).json({ message: "Payload missing" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    validateData2(payload);

    const result = await addExamServices(payload, classNo);

    const keys = [
      `${payload.type}:${classNo}:${academicYear}:student`,
      `${payload.type}:${classNo}:${academicYear}:teacher`,
      `${payload.type}:${classNo}:${academicYear}:authority`,
    ];

    await Promise.all(keys.map((key) => redisClient.del(key)));

    return res.status(200).json({
      success: true,
      data: result.updated,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};
