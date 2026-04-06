import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { student } from "../types/students.types";
import { formatDate } from "../utils/DisplayMonthlyAttendanceHelpers";

const StudentsTable = (data:student) => {
  const navigate = useNavigate();
 

  return (
    <div
      className="grid grid-cols-7 items-center w-full text-sm gap-4"
      onDoubleClick={() => navigate(`/student/profile/${data._id}`)}
    >
      <div className="flex justify-center">
        {data.profilePicUrl ? (
          <div className="relative group">
            <img
              src={data.profilePicUrl}
              alt={data.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 group-hover:border-blue-500 transition-all duration-300 shadow-md"
            />
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>

      <div className="col-span-1">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-white font-semibold group-hover:text-blue-400 transition-colors duration-300">
            {data.name}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      <div className="col-span-1">
        <span className="px-3 py-1 bg-slate-800/60 text-slate-300 rounded-lg text-xs font-bold">
          #{data.rollNo}
        </span>
      </div>

      <div className="col-span-1">
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-bold">
          {data.class}
        </span>
      </div>

      <div className="col-span-1">
        <span className="text-slate-400 text-xs">{formatDate(data.dob)}</span>
      </div>

      <div className="col-span-1">
        <span className="text-slate-400 text-xs">{data.phone || "-"}</span>
      </div>

      <div className="col-span-1">
        <span
          className="text-slate-400 text-xs truncate block"
          title={data.address?.city}
        >
          {data.address?.city || "-"}
        </span>
      </div>
    </div>
  );
};

export default StudentsTable;
