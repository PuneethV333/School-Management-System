import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import { getUserData } from "../services/getUserData.services";
import { IStudent } from "../models/student.module";
import {
  getSyllabusBySubject,
  getTimeTable,
} from "../services/academic.services";
import { getVal, setValKey } from "../utils/redis.utils";
import { SUBJECT_MAP } from "../contants/subject.contants";



export const getTimeTableByClass = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({ message: "unauthorized" });
    }

    let classNo: number;

    if (reqUser.role === "student") {
      const user = (await getUserData(reqUser)) as IStudent;
      classNo = user.class;
    } else {
      const parsed = parseInt(req.params.classNo as string, 10);

      if (!parsed || isNaN(parsed)) {
        return res.status(400).json({ message: "Invalid classNo" });
      }

      classNo = parsed;
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR!;
    const cacheKey = `timetable:${academicYear}:${classNo}`;

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    const result = await getTimeTable(classNo);

    if (!result) {
      return res.status(404).json({ message: "data not found" });
    }

    await setValKey(cacheKey, JSON.stringify(result), 3600);

    return res.status(200).json({
      data: result,
      source: "db",
    });
  } catch (err) {
    return res.status(500).json(getError(err));
  }
};



export const getSyllabus = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const subjectRaw = req.params.subject as string;

    if (!subjectRaw) {
      return res.status(400).json({ message: "subject is required" });
    }

    const key = subjectRaw.toLowerCase().trim();
    const subject = SUBJECT_MAP[key as keyof typeof SUBJECT_MAP];

    if (!subject) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    let classNo: number;

    if (reqUser.role === "student") {
      const user = (await getUserData(reqUser)) as IStudent;
      classNo = user.class;
    } else {
      const parsed = parseInt(req.query.classNo as string, 10);

      if (!parsed || isNaN(parsed)) {
        return res.status(400).json({ message: "Invalid classNo" });
      }

      classNo = parsed;
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR!;
    const cacheKey = `syllabus:${academicYear}:${classNo}:${subject}`;

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    const result = await getSyllabusBySubject({
      subject,
      classNo,
    });

    if (!result) {
      return res.status(404).json({ message: "data not found" });
    }

    await setValKey(cacheKey, JSON.stringify(result), 3600);

    return res.status(200).json({
      data: result,
      source: "db",
    });
  } catch (err) {
    return res.status(500).json(getError(err));
  }
};
