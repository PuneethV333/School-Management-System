import { Response, Request } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import Teacher, { teacher } from "../models/teacher.module";
import { getVal, setValKey } from "../utils/redis.utils";
import { createNewTeacher, validateData } from "../services/teacher.services";
import { redisClient } from "../config/redis";

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser || reqUser.role === "student") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const cacheKey = "teachers";

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "cache",
      });
    }

    const teachers: teacher[] = await Teacher.find();

    if (teachers.length === 0) {
      return res.status(404).json({
        message: "No teachers found",
      });
    }

    await setValKey(cacheKey, JSON.stringify(teachers));

    return res.status(200).json({
      data: teachers,
      source: "db",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export interface addNewTeacherPayload {
  name: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  email: string;
  phone: string;
  address: string;
  subjects: string[];
  experience: number;
  qualification: string;
}

export const addTeacher = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (reqUser.role !== "authority") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payload = req.body as addNewTeacherPayload;

    validateData(payload);

    const teacher = await createNewTeacher(payload);

    await redisClient.del("teachers");

    return res.status(201).json({
      data: teacher,
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};
