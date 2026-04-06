import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { teachers } from "../types/teacher.types";
import { formatDate } from "../utils/DisplayMonthlyAttendanceHelpers";

const TeachersTable = (data :teachers) => {
  const navigate = useNavigate();



  return (
    <div
      className="grid grid-cols-5 items-center w-full text-sm gap-4 cursor-pointer"
      onDoubleClick={() => navigate(`/teacher/profile/${data._id}`)}
    >
      
      <div className="flex justify-center">
        {data.profilePicUrl ? (
          <img
            src={data.profilePicUrl}
            alt={data.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 hover:border-blue-500 transition-all duration-300 shadow-md"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>

      
      <div>
        <span className="text-white font-semibold hover:text-blue-400 transition-colors duration-300">
          {data.name || "-"}
        </span>
      </div>

      
      <div>
        <span className="text-slate-400 text-xs">
          {formatDate(data.dob)}
        </span>
      </div>

      
      <div>
        <span className="text-slate-400 text-xs">
          {data.phone || "-"}
        </span>
      </div>

      
      <div>
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

export default TeachersTable;
