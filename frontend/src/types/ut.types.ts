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

export interface incomingDataPayload {
  authId: string;
  marksObtained: number;
}

export interface addUTPayload {
  data: incomingDataPayload[];
  examDate: Date;
  subjectName: "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English";
  maxMarks: number;
  utNo: number;
}


export type AddUtMarksResponse = {
  success: boolean;
  message: string;
};

export type AddUtMarksError = Error; // or AxiosError if you're using axios


