import type React from "react";

interface SelectClassProps {
  classNo: number;
  setClassNo: React.Dispatch<React.SetStateAction<number>>;
}

const SelectClass: React.FC<SelectClassProps> = ({ classNo, setClassNo }) => {
  const classNos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
        Select Class
      </label>

      <div className="flex flex-wrap gap-2">
        {classNos.map((x) => {
          const isActive = classNo === x;
          return (
            <button
              key={x}
              type="button"
              onClick={() => setClassNo(x)}
              className={`
                relative w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200
                ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105"
                    : "bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-slate-800"
                }
              `}
            >
              {x}
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/60" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectClass;