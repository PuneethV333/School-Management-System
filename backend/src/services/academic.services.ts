import Class from "../models/class.module";
import Syllabus from "../models/syllabus.module";
import { SubjectType } from "../contants/subject.contants";

export const getTimeTable = async (classNo: number) => {
  const academicYear = process.env.CURRENT_ACADEMIC_YEAR!;

  const classData = await Class.findOne(
    { classNo, academicYear },
    { timetable: 1, _id: 0 },
  ).lean();

  return classData?.timetable || null;
};

export interface getSyllabusPayload {
  subject: SubjectType;
  classNo: number;
}

export const getSyllabusBySubject = async (payload: getSyllabusPayload) => {
  const res = await Syllabus.findOne(payload).lean();

  return res?.syllabus || null;
};
