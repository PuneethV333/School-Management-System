export interface studentAuthIdMarkObj {
  authId: string;
}

export interface markStudentAttendanceProps {
  selectedStudents: studentAuthIdMarkObj[];
  classNo: number;
}