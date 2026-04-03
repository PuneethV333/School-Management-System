import {
  addExamPayload,
  addUTPayload,
  incomingDataPayload,
} from "../controllers/marks.controller";
import ExamTest from "../models/examtest.module";
import Marks from "../models/marks.module";
import Student from "../models/student.module";

export const validateData = (payload: addUTPayload) => {
  if (!payload.utNo || payload.utNo < 1) {
    throw new Error("Invalid UT number");
  }

  if (!payload.maxMarks || payload.maxMarks <= 0) {
    throw new Error("Invalid max marks");
  }

  if (isNaN(new Date(payload.examDate).getTime())) {
    throw new Error("Invalid exam date");
  }

  return true;
};

export const validateData2 = (payload: addExamPayload) => {
  if (!payload.maxMarks || payload.maxMarks <= 0) {
    throw new Error("Invalid max marks");
  }

  if (isNaN(new Date(payload.examDate).getTime())) {
    throw new Error("Invalid exam date");
  }

  return true;
};

export interface AddUTServicePayload {
  utNo: number;
  subjectName: "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English";
  maxMarks: number;
  examDate: Date;
  data: incomingDataPayload[];
}

export const addUtServices = async (
  payload: AddUTServicePayload,
  classNo: number,
) => {
  try {
    const { utNo, subjectName, maxMarks, examDate, data } = payload;

    const utName = `UT-${utNo}`;
    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;

    if (!academicYear) throw new Error("Academic year not found");

    const students = await Student.find({ class:classNo }).lean();
    if (!students.length) throw new Error("No students found");

    const studentMap: Record<string, any> = {};
    students.forEach((s) => (studentMap[s.authId] = s._id));

    if (utNo > 1) {
      const prevUT = `UT-${utNo - 1}`;

      const prevExists = await Marks.findOne({
        class: classNo,
        academicYear,
        "subjects.assessments.name": prevUT,
      });

      if (!prevExists) {
        throw new Error(`${prevUT} must be added before ${utName}`);
      }
    }

    const utExists = await Marks.findOne({
      class: classNo,
      academicYear,
      "subjects.subject": subjectName,
      "subjects.assessments.name": utName,
    });

    if (utExists) {
      throw new Error(`${utName} already exists for ${subjectName}`);
    }

    await Marks.bulkWrite(
      students.map((s) => ({
        updateOne: {
          filter: { studentId: s._id, class: classNo, academicYear },
          update: {
            $setOnInsert: {
              studentId: s._id,
              class: classNo,
              section: s.section || "A",
              academicYear,
              subjects: [],
            },
          },
          upsert: true,
        },
      })),
    );

    const bulkOps = [];

    for (const entry of data) {
      const studentId = studentMap[entry.authId];
      if (!studentId) continue;

      if (
        typeof entry.marksObtained !== "number" ||
        entry.marksObtained < 0 ||
        entry.marksObtained > maxMarks
      )
        continue;

      bulkOps.push({
        updateOne: {
          filter: { studentId, class: classNo, academicYear },
          update: {
            $addToSet: {
              subjects: { subject: subjectName, assessments: [] },
            },
          },
        },
      });

      bulkOps.push({
        updateOne: {
          filter: {
            studentId,
            class: classNo,
            academicYear,
            "subjects.subject": subjectName,
            "subjects.assessments.name": { $ne: utName },
          },
          update: {
            $push: {
              "subjects.$.assessments": {
                type: "UT",
                name: utName,
                marksObtained: entry.marksObtained,
                maxMarks,
                examDate,
              },
            },
          },
        },
      });
    }

    if (bulkOps.length) await Marks.bulkWrite(bulkOps);

    return {
      message: `${utName} added successfully`,
      updated: bulkOps.length / 2,
    };
  } catch (err) {
    throw err;
  }
};

export interface AddExamServicePayload {
  type: "FA-1" | "FA-2" | "FA-3" | "FA-4" | "SA-1" | "SA-2";
  subjectName: "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English";
  maxMarks: number;
  examDate: Date;
  data: incomingDataPayload[];
}

export const addExamServices = async (
  payload: AddExamServicePayload,
  classNo: number,
) => {
  try {
    const { type, subjectName, maxMarks, examDate, data } = payload;

    const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
    if (!academicYear) throw new Error("Academic year not found");

    const students = await Student.find({ classNo }).lean();
    if (!students.length) throw new Error("No students found");

    const studentMap: Record<string, any> = {};
    students.forEach((s) => (studentMap[s.authId] = s._id));

    await ExamTest.bulkWrite(
      students.map((s) => ({
        updateOne: {
          filter: { studentId: s._id, classNo, academicYear },
          update: {
            $setOnInsert: {
              studentId: s._id,
              classNo,
              section: s.section || "A",
              academicYear,
              subjects: [],
            },
          },
          upsert: true,
        },
      })),
    );

    const bulkOps = [];

    for (const entry of data) {
      const studentId = studentMap[entry.authId];
      if (!studentId) continue;

      if (
        typeof entry.marksObtained !== "number" ||
        entry.marksObtained < 0 ||
        entry.marksObtained > maxMarks
      )
        continue;

      bulkOps.push({
        updateOne: {
          filter: { studentId, classNo, academicYear },
          update: {
            $addToSet: {
              subjects: { subject: subjectName, assessments: [] },
            },
          },
        },
      });

      bulkOps.push({
        updateOne: {
          filter: {
            studentId,
            classNo,
            academicYear,
            "subjects.subject": subjectName,
            "subjects.assessments.type": { $ne: type },
          },
          update: {
            $push: {
              "subjects.$.assessments": {
                type,
                marksObtained: entry.marksObtained,
                maxMarks,
                examDate,
              },
            },
          },
        },
      });
    }

    if (bulkOps.length) await ExamTest.bulkWrite(bulkOps);

    return {
      message: `${type} added successfully`,
      updated: bulkOps.length / 2,
    };
  } catch (err) {
    throw err;
  }
};
