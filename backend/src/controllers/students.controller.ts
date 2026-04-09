export interface studentGeneralData {
    name: string;
    dob: string;
    gender: "Male" | "Female" | "Other";
    academicYear: string;
    class: number;
    section: string;
    email?: string;
    phone?: string;
    satsNo?: string;
    bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
}

export interface father {
    name: string;
    dob: string;
    occupation: string;
    phone: string;
}

export interface mother {
    name: string;
    dob: string;
    occupation: string;
    phone: string;
}

export interface guardian {
    name: string;
    phone: string;
}

export interface address {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: "India";
}

export interface addStudentInput {
    student: studentGeneralData;
    father?: father;
    mother?: mother;
    guardian: guardian;
    address: address;
}

import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import * as studentServices from "../services/student.services";
import { getUserData } from "../services/getUserData.services";
import { getVal, setValKey } from "../utils/redis.utils";
import Student, { IStudent } from "../models/student.module";
import Class from "../models/class.module";
import { redisClient } from "../config/redis";

export const getStudentsByClass = async (req: Request, res: Response) => {
    try {
        const reqUser = req.user as AuthToken;

        if (!reqUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
        if (!academicYear) {
            throw new Error("academicYear not found");
        }

        let classNo: number;
        let section: string;

        if (reqUser.role === "student") {
            const user = (await getUserData(reqUser)) as IStudent;

            classNo = user.class;
            section = user.section;
        } else {
            classNo = Number(req.params.classNo);
            section = String(req.params.section || "A");

            if (!classNo) {
                throw new Error("Class number is required");
            }
        }

        const cacheKey = `class:${classNo}:section:${section}:year:${academicYear}`;

        const cached = await getVal(cacheKey);

        if (cached) {
            return res.status(200).json({
                message: "Data fetched (cache)",
                data: JSON.parse(cached),
            });
        }

        const result = await studentServices.getStudentsByClassServices({
            class: classNo,
            section,
        });

        await setValKey(cacheKey, JSON.stringify(result), 300);

        return res.status(200).json({
            message: "Data fetched",
            data: result,
        });
    } catch (err) {
        return res.status(400).json(getError(err));
    }
};

export const addNewStudent = async (req: Request, res: Response) => {
    try {
        const reqUser = req.user as AuthToken;

        if (!reqUser || reqUser.role !== "authority") {
            return res.status(403).json({ message: "unauthorized" });
        }

        const payload = req.body as addStudentInput;

        studentServices.validateData(payload);

        let classRecord = await Class.findOne({
            academicYear: payload.student.academicYear,
            classNo: payload.student.class,
            section: payload.student.section,
        });

        if (!classRecord) {
            classRecord = await Class.create({
                academicYear: payload.student.academicYear,
                classNo: payload.student.class,
                section: payload.student.section,
                countOfBoys: 0,
                countOfGirls: 0,
            });
        }

        const studentCount = await Student.countDocuments({
            academicYear: payload.student.academicYear,
            class: payload.student.class,
            section: payload.student.section,
        });

        const nextRollNo = studentCount + 1;

        const authId = studentServices.generateAuthId(
            payload.student.class,
            nextRollNo,
        );

        const result = await studentServices.createStudent(payload, authId);

        await Class.updateOne(
            {
                academicYear: payload.student.academicYear,
                classNo: payload.student.class,
                section: payload.student.section,
            },
            {
                $inc:
                    payload.student.gender === "Male"
                        ? { countOfBoys: 1 }
                        : payload.student.gender === "Female"
                            ? { countOfGirls: 1 }
                            : {},
            },
        );

        const cacheKey = `class:${payload.student.class}:section:${payload.student.section}:year:${payload.student.academicYear}`;
        await redisClient.del(cacheKey);

        return res.status(201).json({ data: result });
    } catch (err) {
        return res.status(400).json(getError(err));
    }
};

export const changeProfilePic = async (req: Request, res: Response) => {
    try {
        const reqUser = req.user as AuthToken;

        if (!reqUser) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const url: string = req.body.url;

        if (!url) {
            return res.status(400).json({ message: "Provide url" });
        }

        const payload = {
            url,
            authId: reqUser.authId,
            role: reqUser.role,
        };

        const response = await studentServices.changeProfilePicBasedOnRole(payload);

        const token = req.cookies?.token;

        if (token) {
            const cacheKey = `session:${token}`;

            await redisClient.del(cacheKey);
        }

        return res.status(200).json({
            message: "Profile updated",
            data: response,
        });
    } catch (err) {
        return res.status(400).json(getError(err));
    }
};

export const getAllStudentsById = async (req: Request, res: Response) => {
    try {
        const reqUser = req.user;
        if (!reqUser) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "id not provider"
            })
        }

        const student = await Student.findOne({ _id: id }).lean();
        if (!student) {
            return res.status(400).json({
                message: "Student not found"
            })
        }

        return res.status(200).json({
            data: student,
            source: 'db'
        })

    } catch (err) {
        return res.status(400).json(getError(err))
    }
}