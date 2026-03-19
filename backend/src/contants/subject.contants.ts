export const SUBJECT_MAP = {
  math: "Math",
  social: "Social",
  science: "Science",
  hindi: "Hindi",
  kannada: "Kannada",
  english: "English",
} as const;

export type SubjectType = (typeof SUBJECT_MAP)[keyof typeof SUBJECT_MAP];
