import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import { getUserData } from "../services/getUserData.services";
import { IStudent } from "../models/student.module";
import { getTimeTable } from "../services/academic.services";
import { getVal, setValKey } from "../utils/redis.utils";
import { SUBJECT_MAP } from "../contants/subject.contants";
import Syllabus from "../models/syllabus.module";



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
            return res.status(401).json({ message: "Unauthorized" });
        }


        const parsed = parseInt(req.params.classNo as string, 10);

        if (!parsed || isNaN(parsed)) {
            return res.status(400).json({ message: "Invalid classNo" });
        }

        const classNo = parsed;

        const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
        if (!academicYear) {
            return res.status(500).json({ message: "Academic year not configured" });
        }

        const cacheKey = `syllabus:${academicYear}:${classNo}`;


        const cached = await getVal(cacheKey);
        if (cached) {
            return res.status(200).json({
                data: JSON.parse(cached),
                source: "redis",
            });
        }


        const syllabusData = await Syllabus.findOne({ classNo: classNo }).lean();
        if (!syllabusData) {
            return res.status(404).json({ message: "Syllabus data not found" });
        }

        await setValKey(cacheKey, JSON.stringify(syllabusData), 3600);

        return res.status(200).json({
            data: syllabusData,
            message: "Syllabus data found",
        });
    } catch (err) {
        console.error("Error fetching Syllabus:", err);
        return res.status(500).json({
            message: "Failed to fetch attendance",
        });
    }
};