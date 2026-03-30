import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { AuthToken } from "../middleware/auth.middleware";
import Student from "../models/student.module";
import StudentAttendance from "../models/studentAttendence.module";
import Teacher from "../models/teacher.module";
import TeacherAttendance from "../models/attendenceForTeacher.module";
import { getVal, setValKey } from "../utils/redis.utils";
import ClassAttendance from "../models/attendence.module";
import Class from "../models/class.module";
import { redisClient } from "../config/redis";
import { helperDataForMarkAttendance } from "../services/validatedMarkStudentAttendanceProp";

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;

    if (!academicYear) {
      return res.status(400).json({
        message: "Academic year not found",
      });
    }

    const cacheKey = `myAttendance:${reqUser.authId}:${academicYear}`;
    const cached = await getVal(cacheKey);

    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    let attendanceData = null;

    if (reqUser.role === "student") {
      const student = await Student.findOne({
        authId: reqUser.authId,
      })
        .lean()
        .populate("student");

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      attendanceData = await StudentAttendance.findOne({
        student: student._id,
        academicYear,
      }).lean();
    }

    if (reqUser.role === "teacher") {
      const teacher = await Teacher.findOne({
        authId: reqUser.authId,
      }).lean();

      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      attendanceData = await TeacherAttendance.findOne({
        teacher: teacher._id,
        academicYear,
      }).lean();
    }

    if (!attendanceData) {
      return res.status(404).json({
        message: "Attendance not found for this academic year",
      });
    }

    await setValKey(cacheKey, JSON.stringify(attendanceData), 300);

    return res.status(200).json({
      data: attendanceData,
      source: "db",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const getAllStudentAttendanceData = async (
  req: Request,
  res: Response,
) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;

    if (!academicYear) {
      return res.status(400).json({
        message: "Academic year not found",
      });
    }

    const cacheKey = `allStudents:${reqUser.authId}:${reqUser.role}:${academicYear}`;
    const cached = await getVal(cacheKey);

    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    let data = [];

    if (["authority", "teacher"].includes(reqUser.role)) {
      data = await StudentAttendance.find({ academicYear })
        .populate("student")
        .lean();

      await setValKey(cacheKey, JSON.stringify(data), 300);

      return res.status(200).json({
        data,
        source: "db",
      });
    }

    if (reqUser.role === "student") {
      const student = await Student.findOne({
        authId: reqUser.authId,
      }).lean();

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      data = await StudentAttendance.find({ academicYear })
        .populate({
          path: "student",
          match: { class: student.class },
        })
        .lean();

      data = data.filter((d: any) => d.student !== null);

      await setValKey(cacheKey, JSON.stringify(data), 300);

      return res.status(200).json({
        data,
        source: "db",
      });
    }

    return res.status(403).json({
      message: "Access denied",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const getStudentAttendanceDataAccClass = async (
  req: Request,
  res: Response,
) => {
  try {
    const reqUser = req.user as AuthToken;
    if (!reqUser || reqUser.role === "student") {
      return res.status(403).json({
        message: "unauthorized",
      });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;

    if (!academicYear) {
      return res.status(400).json({
        message: "Academic year not found",
      });
    }

    const classNo = parseInt(req.params.classNo as string, 10);
    if (isNaN(classNo)) {
      return res.status(400).json({
        message: "class number not provided",
      });
    }

    const cacheKey = `Attendance-of-student-Of-Class:${classNo}:${academicYear}`;

    const cached = await getVal(cacheKey);

    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    const data = await StudentAttendance.find({
      academicYear: academicYear,
      class: classNo,
    })
      .populate("student", "name authId")
      .lean();

    if (data.length === 0) {
      return res.status(400).json({
        message: "data not found",
      });
    }

    await setValKey(cacheKey, JSON.stringify(data), 300);

    return res.status(200).json({
      data: data,
      source: "db",
    });
  } catch (err) {
    res.status(400).json(getError(err));
  }
};
export const getAllTeacherAttendanceData = async (
  req: Request,
  res: Response,
) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!["authority"].includes(reqUser.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;

    if (!academicYear) {
      return res.status(400).json({
        message: "Academic year not found",
      });
    }

    const cacheKey = `allTeacher:${reqUser.authId}:${reqUser.role}:${academicYear}`;

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    const data = await TeacherAttendance.find({ academicYear })
      .populate("teacher", "name email subject")
      .lean();

    await setValKey(cacheKey, JSON.stringify(data), 300);

    return res.status(200).json({
      data,
      source: "db",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export const getClassAttendanceData = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;

    if (!reqUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["teacher", "authority"].includes(reqUser.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const classNo = parseInt(req.params.classNo as string, 10);
    if (isNaN(classNo)) {
      return res.status(400).json({ message: "Invalid classNo" });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) {
      return res.status(400).json({ message: "Academic year not found" });
    }

    const classDoc = await Class.findOne({ classNo, academicYear })
      .select("_id")
      .lean();

    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    const classId = classDoc._id;

    const cacheKey = `classAttendance:${classId}:${academicYear}`;

    const cached = await getVal(cacheKey);
    if (cached) {
      return res.status(200).json({
        data: JSON.parse(cached),
        source: "redis",
      });
    }

    const data = await ClassAttendance.findOne({
      academicYear,
      class: classId,
    })
      .populate("class")
      .lean();

    await setValKey(cacheKey, JSON.stringify(data), 300);

    return res.status(200).json({
      data,
      source: "db",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};

export interface studentAuthIdMarkObj {
  authId: string;
}

export interface markStudentAttendanceProps {
  selectedStudents: studentAuthIdMarkObj[];
  classNo: number;
}

export const markStudentAttendance = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user as AuthToken;
    if (!reqUser || reqUser.role === "student") {
      return res.status(403).json({
        message: "unauthorized",
      });
    }

    const props: markStudentAttendanceProps =
      req.body.markStudentAttendanceProps;

    if (!props) {
      return res.status(400).json({
        message: "data not provided",
      });
    }

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) {
      return res.status(400).json({
        message: "academicYear not found",
      });
    }

    const cacheKey = `Attendance-of-student-Of-Class:${props.classNo}:${academicYear}`;

    await redisClient.del(cacheKey);
    
    const result = await helperDataForMarkAttendance(props);
    
    if(!result){
        return res.status(400).json({
            message:"some-thing went wrong"
        })
    }

    return res.status(200).json({
      message: "attendance updated",
    });
  } catch (err) {
    return res.status(400).json(getError(err));
  }
};
