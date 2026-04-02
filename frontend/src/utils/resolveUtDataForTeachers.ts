import type { examType } from "../pages/subPages/ViewMark/teacher/TeacherExam";
import type { Subject } from "../types/students.types";

export interface studentId {
  name: string;
  _id: string;
}

export interface utData {
  _id: string;
  subjects: Subject[];
  class: number;
  section: string;
  academicYear: string;
  studentId: studentId;
}

export interface ExamData {
  _id: string;
  subjects: Subject[];
  class: number;
  section: string;
  academicYear: string;
  studentId: studentId;
}

export interface result {
  name: string;
  authId: string;
  subject: string;
  marks: number | null;
  maxMarks: number | null;
  type: "ut-1" | "ut-2" | "ut-3" | "ut-4";
}
export interface resultForExam {
  name: string;
  authId: string;
  subject: string;
  marks: number | null;
  maxMarks: number | null;
  type: examType;
}

const subjectAliasMap: Record<string, string[]> = {
  mathematics: ["mathematics", "maths", "math"],
  english: ["english"],
  science: ["science"],
  "social science": ["social science", "social"],
  hindi: ["hindi"],
  kannada: ["kannada"],
};

const normalizeSubject = (raw: string): string => {
  const lower = raw.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(subjectAliasMap)) {
    if (aliases.some((alias) => lower === alias || lower.includes(alias))) {
      return canonical;
    }
  }
  return lower;
};



export const getGrade = (marks: number, max: number = 20) => {
  const pct = (marks / max) * 100;
  if (pct >= 90) return { label: "A+", color: "text-emerald-400" };
  if (pct >= 75) return { label: "A", color: "text-green-400" };
  if (pct >= 60) return { label: "B", color: "text-yellow-400" };
  if (pct >= 40) return { label: "C", color: "text-orange-400" };
  return { label: "F", color: "text-red-400" };
};

export const resolveData = (
  utData: utData[],
  subject: string,
  type: "ut-1" | "ut-2" | "ut-3" | "ut-4",
): result[] => {
  return utData.map((i) => {
    const val = i.subjects.find(
      (x) => normalizeSubject(x.subject) === normalizeSubject(subject),
    );

    const assessment = val?.assessments.find(
      (x) => x.name.toLowerCase() === type.toLowerCase(),
    );

    return {
      name: i.studentId.name,
      authId: i.studentId._id,
      type,
      marks: assessment?.marksObtained ?? null,
      maxMarks: assessment?.maxMarks ?? null,
      subject,
    };
  });
};

export const resolveExamDataForTeacher = (examData: ExamData[],
  subject: string,
  type: examType,):resultForExam[] => {
    return examData?.map((i) => {
    const val = i.subjects.find(
      (x) => normalizeSubject(x.subject) === normalizeSubject(subject),
    );

    const assessment = val?.assessments.find(
      (x) => x.type.toLowerCase() === type.toLowerCase(),
    );

    return {
      name: i.studentId.name,
      authId: i.studentId._id,
      type,
      marks: assessment?.marksObtained ?? null,
      maxMarks: assessment?.maxMarks ?? null,
      subject,
    };
  });
}