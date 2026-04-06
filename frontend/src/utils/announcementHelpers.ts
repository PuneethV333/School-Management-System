import type React from "react";
import toast from "react-hot-toast";
import type { Attachment } from "../types/announcement.types";

export type category =
  | "General"
  | "Exam"
  | "Holiday"
  | "Event"
  | "Fee"
  | "Emergency";

export const formatDate = (date: Date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCategoryColor = (category: category) => {
  const colors = {
    General: "from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-300",
    Exam: "from-red-500/20 to-red-600/20 border-red-500/50 text-red-300",
    Holiday:
      "from-green-500/20 to-green-600/20 border-green-500/50 text-green-300",
    Event:
      "from-purple-500/20 to-purple-600/20 border-purple-500/50 text-purple-300",
    Fee: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-300",
    Emergency:
      "from-orange-500/20 to-orange-600/20 border-orange-500/50 text-orange-300",
  };
  return colors[category] || colors.General;
};

export const getCategoryIcon = (categoryDashboard: category) => {
  switch (categoryDashboard) {
    case "Emergency":
      return "🚨";
    case "Exam":
      return "📝";
    case "Holiday":
      return "🎉";
    case "Event":
      return "🎪";
    case "Fee":
      return "💰";
    default:
      return "📢";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const categories = [
  { value: "General", color: "from-slate-500 to-slate-600", icon: "📢" },
  { value: "Exam", color: "from-blue-500 to-cyan-500", icon: "📝" },
  { value: "Holiday", color: "from-green-500 to-emerald-500", icon: "🎉" },
  { value: "Event", color: "from-purple-500 to-pink-500", icon: "🎪" },
  { value: "Fee", color: "from-orange-500 to-amber-500", icon: "💰" },
  { value: "Emergency", color: "from-red-500 to-rose-500", icon: "🚨" },
];

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      content: string;
      category: string;
      classes: never[];
      expireAt: string;
    }>
  >,
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  attachments: Attachment[] | undefined,
  setAttachments: React.Dispatch<
    React.SetStateAction<Attachment[] | undefined>
  >,
) => {
  const files = e.target.files ? Array.from(e.target.files) : [];
  if (files.length + (attachments?.length || 0) > 5) {
    toast.error("Maximum 5 files allowed");
    return;
  }
  setAttachments((prev) => [...prev, ...files]);
};


