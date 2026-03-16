import Student from "../models/student.module";

export interface getStudentsByClassInput {
  role:'teacher'|'authority'|'student'
  authId:string
}

export const  getStudentsByClassServices = async (payload:getStudentsByClassInput) => {
     let students = [];

    if (payload.role === "student") {
      const student = await Student.findOne({ authId:payload.authId }).lean();
      if (!student) {
        throw new Error("student not found");
      }

      students = await Student.find({ class: student.class }).lean();
    } else if (payload.role === "teacher") {
      students = await Student.find().lean();
    } else if (payload.role === "authority") {
      students = await Student.find().lean();
    }
    
    
}