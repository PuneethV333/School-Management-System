import validator from "validator";
import { addStudentInput } from "../controllers/students.controller";
import Student, { IStudent } from "../models/student.module";
import {
  formatIndianPhone,
  validateIndianPhone,
} from "../utils/phoneNumberValidator.utils";
import Teacher from "../models/teacher.module";
import Authority from "../models/authority.module";

export interface getStudentsByClassInput {
  class: number;
  section:string
}

export const getStudentsByClassServices = async (
  payload: getStudentsByClassInput,
): Promise<IStudent[]> => {
  try {
    const students: IStudent[] = await Student.find({
      section:payload.section,
      class: payload.class,
    });

    if (students.length === 0) {
      throw new Error("No students found");
    }

    return students;
  } catch (err) {
    throw err;
  }
};

export const validateData = (payload: addStudentInput) => {
  if (!payload.student) {
    throw new Error("student data not provided");
  }

  if (payload.student.class < 1 || payload.student.class > 10) {
    throw new Error("invalid class number");
  }

  if (!payload.guardian) {
    throw new Error("guardian is required");
  }

  if (!payload.student.dob) {
    throw new Error("dob not provided");
  }

  const dob = new Date(payload.student.dob);

  if (isNaN(dob.getTime())) {
    throw new Error("Invalid DOB");
  }

  let age = new Date().getFullYear() - dob.getFullYear();
  const m = new Date().getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) {
    age--;
  }

  if (age < 5 || age > 17) {
    throw new Error("invalid age");
  }

  if (payload.student.phone && !validateIndianPhone(payload.student.phone)) {
    throw new Error("Invalid student phone");
  }

  if (payload.father?.phone && !validateIndianPhone(payload.father.phone)) {
    throw new Error("Invalid father phone");
  }

  if (payload.mother?.phone && !validateIndianPhone(payload.mother.phone)) {
    throw new Error("Invalid mother phone");
  }

  if (!validateIndianPhone(payload.guardian.phone)) {
    throw new Error("Invalid guardian phone");
  }

  if (payload.student.phone) {
    payload.student.phone = formatIndianPhone(payload.student.phone)!;
  }

  if (payload.father?.phone) {
    payload.father.phone = formatIndianPhone(payload.father.phone)!;
  }

  if (payload.mother?.phone) {
    payload.mother.phone = formatIndianPhone(payload.mother.phone)!;
  }

  if (payload.student.email && !validator.isEmail(payload.student.email)) {
    throw new Error("Invalid student email");
  }

  return true;
};

export const generateAuthId = (classNum: number, rollNo: number) => {
  const classPart = String(classNum).padStart(2, "0");
  const rollPart = String(rollNo).padStart(2, "0");
  return `vbhs${classPart}${rollPart}`;
};

export const createStudent = async (input: addStudentInput, authId: string) => {
  const payload = {
    name: input.student.name,
    dob: new Date(input.student.dob),

    class: input.student.class,
    section: input.student.section,
    academicYear: input.student.academicYear,

    email: input.student.email,
    phone: input.student.phone,
    gender: input.student.gender,
    bloodGroup: input.student.bloodGroup,
    satsNo: input.student.satsNo,

    father: input.father
      ? {
          ...input.father,
          dob: input.father.dob ? new Date(input.father.dob) : undefined,
        }
      : undefined,

    mother: input.mother
      ? {
          ...input.mother,
          dob: input.mother.dob ? new Date(input.mother.dob) : undefined,
        }
      : undefined,

    guardian: input.guardian,

    address: input.address,

    authId,
  };

  return await Student.create(payload);
};

export interface changeProfilePicInput {
  url: string;
  authId: string;
  role: 'student'|'authority'|'teacher';
}

export const changeProfilePicBasedOnRole = async (payload:changeProfilePicInput) => {
    let user;
    if(payload.role === 'student'){
        user = await Student.findOneAndUpdate({authId:payload.authId},{profilePicUrl:payload.url});
    }else if(payload.role === 'teacher'){
        user = await Teacher.findOneAndUpdate({authId:payload.authId},{profilePicUrl:payload.url})
    }else if(payload.role === 'authority'){
        user = await Authority.findOneAndUpdate({authId:payload.authId},{profilePicUrl:payload.url});
    }
    return user;
};
