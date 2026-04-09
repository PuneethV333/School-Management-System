import { AlertCircle, Loader } from "lucide-react";
import type {
  errorState,
  iconCard,
  sectionCard,
} from "../types/studentProfile.types";

export const InfoCard = ({
  icon: Icon,
  label,
  value,
  isEmpty = false,
}: iconCard) => (
  <div
    className={`flex items-start gap-3 p-3 rounded-lg backdrop-blur-sm border transition-colors ${
      isEmpty
        ? "bg-slate-800/20 border-slate-700/30"
        : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/40"
    }`}
  >
    <Icon
      className={`w-4 h-4 mt-1 shrink-0 ${
        isEmpty ? "text-slate-500" : "text-blue-400"
      }`}
    />
    <div className="min-w-0 flex-1">
      <p className={`text-xs ${isEmpty ? "text-slate-500" : "text-slate-400"}`}>
        {label}
      </p>
      <p className="text-sm text-slate-200 font-medium wrap-break-words">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export const SectionCard = ({ title, children, icon: Icon }: sectionCard) => (
  <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
      <h2 className="text-lg font-bold text-slate-200">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
  </div>
);

export const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen gap-3 text-slate-400">
    <Loader className="w-5 h-5 animate-spin" />
    <span>Loading student profile...</span>
  </div>
);

export const ErrorState = ({ message, title = "Error" }: errorState) => (
  <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-400 font-semibold">{title}</h3>
          <p className="text-red-300 text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  </div>
);
