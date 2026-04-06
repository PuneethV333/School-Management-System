import { useState } from "react";

import useIsMobile from "../../../../hooks/useIsMobile";
import { Search, Users } from "lucide-react";

import { useFetchStudentsByClass } from "../../../../hooks/useStudentData";
import { useFetchMe } from "../../../../hooks/useAuth";
import type { student } from "../../../../types/students.types";
import StudentsTable from "../../../../components/StudentsTable";
import SelectClass from "../../../../components/SelectClass";

const Teacher = () => {
  const { data: userData } = useFetchMe();
  const [classNo,setClassNo] = useState<number>(1);
  const { data: studentsData } = useFetchStudentsByClass(userData, classNo);

  const isMobile = useIsMobile();

  const [searchName, setSearchName] = useState("");

  const headers = [
    "Profile Pic",
    "Student Name",
    "Roll Number",
    "Class",
    "DOB",
    "Phone",
    "Address",
  ];

 

  const filteredStudents = (studentsData || [])
    .filter((student: student) => {
      const matchesName = student.name
        ?.toLowerCase()
        .includes(searchName.toLowerCase());

      if (userData?.role === "teacher" || userData?.role === "authority") {
        return matchesName && student.class === classNo;
      }

      return matchesName;
    })
    .sort((a: student, b: student) => {
      const rollA = a.rollNo || 0;
      const rollB = b.rollNo || 0;
      return rollA - rollB;
    });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Students
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                View and manage student directory
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search student name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 focus:border-blue-500 transition-all duration-300 pl-12 pr-4 py-3 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
          
          
          <SelectClass classNo={classNo} setClassNo={setClassNo}/>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
              {filteredStudents.length}{" "}
              {filteredStudents.length === 1 ? "Student" : "Students"}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div
            className={`${
              isMobile
                ? "overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700"
                : "overflow-x-hidden"
            }`}
          >
            <div className={`${isMobile ? "min-w-225" : "min-w-full"}`}>
              <div className="grid grid-cols-7 px-6 py-4 bg-linear-to-r from-blue-900/40 to-cyan-900/40 border-b border-slate-700/50 text-xs sm:text-sm font-bold uppercase tracking-wider sticky top-0 z-10">
                {headers.map((h, idx) => (
                  <span key={idx} className="text-slate-300">
                    {h}
                  </span>
                ))}
              </div>

              {filteredStudents.length > 0 ? (
                <div className="divide-y divide-slate-700/30">
                  {filteredStudents.map((student: student) => (
                    <div
                      key={student._id}
                      className="px-6 py-4 bg-slate-800/20 hover:bg-slate-700/30 transition-colors duration-300 border-b border-slate-700/20 text-sm"
                    >
                      <StudentsTable {...student} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium mb-2">
                    No students found
                  </p>
                  <p className="text-slate-500 text-sm">
                    {searchName
                      ? "Try adjusting your search criteria"
                      : "No students available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredStudents.length > 0 && (
          <div className="mt-8 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 font-semibold">
              💡 Tip: Hover over rows for better visibility. Use search and
              filters to find students quickly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teacher;
