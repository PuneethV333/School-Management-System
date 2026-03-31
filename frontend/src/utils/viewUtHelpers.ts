export const getPercentage = (marks: number, max: number) =>
  max > 0 ? Math.round((marks / max) * 100) : 0;

export const getScoreColor = (percentage: number) => {
  if (percentage >= 90) return "bg-emerald-500/20 text-emerald-300";
  if (percentage >= 80) return "bg-blue-500/20 text-blue-300";
  if (percentage >= 70) return "bg-amber-500/20 text-amber-300";
  if (percentage >= 60) return "bg-orange-500/20 text-orange-300";
  return "bg-red-500/20 text-red-300";
};

export const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";
