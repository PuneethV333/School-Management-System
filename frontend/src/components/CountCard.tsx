import type { countCardInputProps } from "../types/CountCard.types";

const CountCard = ({ icon: Icon, title, count }: countCardInputProps) => {
  return (
    <div className="flex-1 min-w-35 px-4 py-4 border border-cyan-700/50 bg-slate-800/60 backdrop-blur-sm rounded-2xl flex flex-col gap-3 hover:border-cyan-500/70 hover:bg-slate-800/80 transition-all duration-200">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Icon className="text-cyan-400 w-5 h-5" />
        </div>
        <p className="text-slate-400 text-xs sm:text-sm font-medium leading-tight">{title}</p>
      </div>
      <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">{count}</span>
    </div>
  );
};

export default CountCard;