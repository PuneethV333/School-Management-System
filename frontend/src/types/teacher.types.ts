import type { address } from "./students.types";

export type teachers = {
  name: string;
  authId: string;
  class: number;
  rollNo: number;
  _id:string|number;
  profilePicUrl:string;
  dob:string;
  phone:string|number;
  gender: "Male" | "Female" | "Other";
  section: string;
  email?: string;
  satsNo?: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  address:address;
};
