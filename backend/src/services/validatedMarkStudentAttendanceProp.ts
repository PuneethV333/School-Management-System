import { markStudentAttendanceProps } from "../controllers/attendance.controller";
import Student from "../models/student.module";
import StudentAttendance from "../models/studentAttendence.module";

export const helperDataForMarkAttendance = async (
  props: markStudentAttendanceProps
) => {
  
  if (props.classNo > 10 || props.classNo <= 0) {
    throw new Error("invalid class number");
  }

  
  const academicYear = process.env.CURRENT_ACADEMIC_YEAR;
  if (!academicYear) {
    throw new Error("academicYear not found");
  }

  
  const students = await Student.find({
    class: props.classNo,
    academicYear: academicYear,
  }).lean();

  if (students.length === 0) {
    throw new Error("students not found");
  }

  
  const startYear = parseInt(academicYear);
  const endYear = startYear + 1;

  const startDate = new Date(`${startYear}-06-01`);
  const endDate = new Date(`${endYear}-03-31`);

  
  const months = await StudentAttendance.initializeAttendance({
    academicYear,
    startDate,
    endDate,
  });

  
  const newDocs = [];

  for (const student of students) {
    const exists = await StudentAttendance.findOne({
      student: student._id,
      academicYear,
    });

    if (!exists) {
      newDocs.push({
        student: student._id,
        academicYear,
        class: props.classNo,
        months,
      });
    }
  }

  
  if (newDocs.length > 0) {
    await StudentAttendance.insertMany(newDocs);
  }

  
  return {
    totalStudents: students.length,
    createdAttendance: newDocs.length,
  };
};