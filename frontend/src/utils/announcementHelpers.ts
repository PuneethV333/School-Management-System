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

export const getCategoryIcon = (categoryDashboard:category) => {
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
  if (!text) return ""
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}