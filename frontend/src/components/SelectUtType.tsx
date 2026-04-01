import type React from "react";

interface SelectClassProps {
  dataType: "ut-1" | "ut-2" | "ut-3" | "ut-4";
  setDataType: React.Dispatch<
    React.SetStateAction<"ut-1" | "ut-2" | "ut-3" | "ut-4">
  >;
}

const SelectUtType: React.FC<SelectClassProps> = ({ dataType, setDataType }) => {
  const types = ["ut-1", "ut-2", "ut-3", "ut-4"] as const;

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
        Select Type
      </label>

      <div className="flex flex-wrap gap-2">
        {types.map((x) => {
          const isActive = dataType === x;

          return (
            <button
              key={x}
              type="button"
              onClick={() => setDataType(x)}
              className={`
                relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105"
                    : "bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-slate-800"
                }
              `}
            >
              {x.charAt(0).toUpperCase() + x.slice(1)}

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

export default SelectUtType;
