import {
  FlaskConical,
  Globe,
  BookOpen,
  Calculator,
  Languages,
} from "lucide-react";
import type { ShowTodaysClassesContainerProps } from "../types/showTodaysClasses.types";
import type { LucideIcon } from "lucide-react";

const subjectStyles: Record<string,{ border: string; badge: string; text: string; icon: LucideIcon }> = {
  Math: {
    border: "border-blue-800",
    badge: "bg-blue-900 text-blue-300",
    text: "text-blue-300",
    icon: Calculator,
  },
  Science: {
    border: "border-green-800",
    badge: "bg-green-900 text-green-300",
    text: "text-green-300",
    icon: FlaskConical,
  },
  Social: {
    border: "border-yellow-700",
    badge: "bg-yellow-900 text-yellow-300",
    text: "text-yellow-300",
    icon: Globe,
  },
  Hindi: {
    border: "border-purple-800",
    badge: "bg-purple-900 text-purple-300",
    text: "text-purple-300",
    icon: Languages,
  },
  Kannada: {
    border: "border-pink-800",
    badge: "bg-pink-900 text-pink-300",
    text: "text-pink-300",
    icon: Languages,
  },
  English: {
    border: "border-orange-800",
    badge: "bg-orange-900 text-orange-300",
    text: "text-orange-300",
    icon: BookOpen,
  },
};

const ShowTodaysClassInDashboard = ({
  classes,
}: ShowTodaysClassesContainerProps) => {
  return (
    <div>
      <h1>Today's class</h1>
      {classes.length > 0 && (
        <div className="flex flex-col justify-around">
          {classes.map((x, idx) => {
            const s = subjectStyles[x.subject] ?? {
              border: "border-gray-200",
              badge: "bg-gray-100 text-gray-700",
              text: "text-gray-700",
              icon: BookOpen,
            };
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-start justify-center border-2 rounded-4xl pl-3 py-1 my-4 ${s.border}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}
                  >
                    <Icon size={12} />
                    {x.subject}
                  </span>
                </div>
                <span
                  className={`text-sm font-mono mt-0.5 ${s.text}`}
                >{`${x.startTime} - ${x.endTime}`}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowTodaysClassInDashboard;
