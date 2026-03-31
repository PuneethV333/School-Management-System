export type Assessment = {
  _id?: string;
  name: string;
  marksObtained: number;
  maxMarks: number;
  examDate?: string;
};

export type SubjectResult = {
  subject: string;
  assessments: Assessment[];
};

export type studentId = {
    authId:string
}

export type UtResult = {
  class?: number;
  section?: string;
  studentId:studentId;
  subjects?: SubjectResult[];
};