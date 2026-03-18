import { addNewTeacherPayload } from "../controllers/teacher.controller";
import Teacher from "../models/teacher.module";
import {
  formatIndianPhone,
  validateIndianPhone,
} from "../utils/phoneNumberValidator.utils";
import validator from "validator";

export const validateData = (payload: addNewTeacherPayload) => {
  if (!payload.name) {
    throw new Error("teacher name not provided");
  }

  const dob = new Date(payload.dob);

  if (isNaN(dob.getTime())) {
    throw new Error("Invalid DOB");
  }

  let age = new Date().getFullYear() - dob.getFullYear();
  const m = new Date().getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18) {
    throw new Error("invalid age");
  }

  if (payload.phone && !validateIndianPhone(payload.phone)) {
    throw new Error("Invalid phone number");
  }

  if (payload.phone) {
    payload.phone = formatIndianPhone(payload.phone)!;
  }

  if (payload.email && !validator.isEmail(payload.email)) {
    throw new Error("Invalid student email");
  }

  if (payload.experience < 0) {
    throw new Error("Invalid experience");
  }

  return true;
};

export const createNewTeacher = async (payload: addNewTeacherPayload) => {
  const existing = await Teacher.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }],
  });

  if (existing) {
    throw new Error("Teacher already exists");
  }

  const lastTeacher = await Teacher.findOne({ authId: /^vbhst\d+$/ })
    .sort({ authId: -1 })
    .lean();

  let nextTeacherNumber = 1;

  if (lastTeacher?.authId) {
    const match = lastTeacher.authId.match(/^vbhst(\d+)$/);
    if (match) {
      nextTeacherNumber = parseInt(match[1], 10) + 1;
    }
  }

  const generatedAuthId = `vbhst${String(nextTeacherNumber).padStart(3, "0")}`;

  const teacherDoc = await Teacher.create({
    ...payload,
    authId: generatedAuthId,
    experience: payload.experience || 0,
  });

  return teacherDoc;
};
