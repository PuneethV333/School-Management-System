export interface Attachment {
  fileName: string;
  fileUrl: string;
}

export interface postAnnouncementInput {
  title: string;
  content: string;
  category: "General" | "Exam" | "Holiday" | "Event" | "Fee" | "Emergency";
  classes?: number[];
  attachments?: Attachment[];
  expireAt: string;
}