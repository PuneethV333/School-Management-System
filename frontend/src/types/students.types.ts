export interface studentGeneralData {
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  academicYear: string;
  class: number;
  section: string;
  email?: string;
  phone?: string;
  satsNo?: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
}

export interface father {
  name: string;
  dob: string;
  occupation: string;
  phone: string;
}

export interface mother {
  name: string;
  dob: string;
  occupation: string;
  phone: string;
}

export interface guardian {
  name: string;
  phone: string;
}

export interface address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: "India";
}

export interface addStudentInput {
  student: studentGeneralData;
  father?: father;
  mother?: mother;
  guardian: guardian;
  address: address;
}

export interface Assessment {
  type: string;
  name: string;
  marksObtained: number;
  maxMarks: number;
  examDate?: string;
}

export interface Subject {
  subject: string;
  assessments: Assessment[];
}