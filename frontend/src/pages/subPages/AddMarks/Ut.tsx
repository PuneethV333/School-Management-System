/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, BookOpen, Calendar, Check, Loader2, Search, Trophy, Users } from "lucide-react";
import Spinner from "../../../components/Spinner";
import { useFetchMe } from "../../../hooks/useAuth";
import { useAddUtMarks } from "../../../hooks/useMarkData";
import { useState, useEffect } from "react";
import { getProgress, getStudentMark, handleMarkChange, subjects } from "../../../utils/addUtHelper";
import type { addUTPayload, incomingDataPayload } from "../../../types/ut.types";
import type { userData } from "../../../types/userData.types";
import toast from "react-hot-toast";
import { useFetchStudentsByClass } from "../../../hooks/useStudentData";

export const Ut = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const { mutate: postUnitTestMarksData, isPending: submitting } = useAddUtMarks();

  const [classNo, setClassNo] = useState<number>(1);
  const [filteredStudents, setFilteredStudents] = useState<userData[]>([]);
  const [utNo, setUtNo] = useState<number>(1);
  const [maxMarks, setMaxMarks] = useState<number>(25);
  const [selectedSubject, setSelectedSubject] = useState<"Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English" | "">("");
  const [examDate, setExamDate] = useState<string>("");
  const [marks, setMarks] = useState<incomingDataPayload[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: students, isPending: loading2 } = useFetchStudentsByClass(userData, classNo);

  useEffect(() => {
    if ((students?.length ?? 0) > 0 && classNo > 0) {
      setFilteredStudents(students!);
      setMarks([]);
    }
  }, [classNo, students]);
  
  console.log(marks.length !== filteredStudents.length);
  

  if (loading) {
    return <Spinner />;
  }

  const handleSubmit = () => {
    if (!selectedSubject || !examDate || !utNo) {
      toast.error("Please fill all test details");
      return;
    }

    if (marks.length !== filteredStudents.length) {
      toast.error("Please enter marks for all students");
      return;
    }

    const payload: addUTPayload = {
      data: marks,
      examDate: new Date(examDate),
      subjectName: selectedSubject,
      maxMarks: Number(maxMarks),
      utNo: Number(utNo),
    };

    postUnitTestMarksData(
      { props: payload, classNo },
      {
        onSuccess: () => {
          setUtNo(1);
          setSelectedSubject("");
          setExamDate("");
          setMarks([]);
          setMaxMarks(25);
        },
      }
    );
  };

  const searchFilteredStudents = filteredStudents?.filter(
    (student: userData) =>
      student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.rollNo?.toString().includes(searchQuery),
  );

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-8 sm:py-12 lg:py-16 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div
        className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 sm:mb-12 animate-fadeIn text-center">
          <div className="inline-flex items-center justify-center p-3 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            Add Unit Test Marks
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Enter student marks for unit tests with ease
          </p>
        </div>

        {/* Test Details */}
        <div
          className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-cyan-400 to-blue-500 rounded-full"></div>
            Test Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.role !== "student" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Select Class
                </label>
                <select
                  value={classNo || 1}
                  onChange={(e) => setClassNo(Number(e.target.value))}
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-cyan-500 focus:border-cyan-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Class {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Select Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as "Math" | "Science" | "Social" | "Hindi" | "Kannada" | "English" | "")}
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-purple-500 focus:border-purple-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map((sub: string) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <span className="text-emerald-400">#</span>
                Unit Test Number
              </label>
              <input
                type="number"
                value={utNo}
                onChange={(e) => setUtNo(Number(e.target.value))}
                disabled={submitting}
                placeholder="Enter unit number"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-emerald-500 focus:border-emerald-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                min={1}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Calendar className="w-4 h-4 text-blue-400" />
                Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-blue-500 focus:border-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Maximum Marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                disabled={submitting}
                placeholder="Enter max marks"
                min={1}
                max={50}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-yellow-500 focus:border-yellow-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 font-medium placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {utNo && (
              <div className="space-y-2 flex items-end">
                <div className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold text-center shadow-lg">
                  Unit Test {utNo}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Students loading state */}
        {loading2 && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-300 font-medium">Loading students...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading2 && filteredStudents.length === 0 && (
          <div className="text-center py-24">
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 text-xl font-semibold">
              No students found
            </p>
            <p className="text-slate-500 mt-2">
              No students enrolled in Class {classNo}
            </p>
          </div>
        )}

        {/* Student list */}
        {!loading2 && filteredStudents.length > 0 && (
          <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>

            {/* Progress bar */}
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  Completion Progress
                </h3>
                <span className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {getProgress(filteredStudents, marks)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${getProgress(filteredStudents, marks)}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {marks.length} of {filteredStudents.length} students completed
              </p>
            </div>

            {/* Search */}
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={submitting}
                  placeholder="Search by name or roll number..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/60 text-white border border-slate-700 focus:border-cyan-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 gap-4 bg-linear-to-r from-slate-700/50 to-slate-800/50 p-4 sm:p-5 font-semibold text-slate-200 border-b border-slate-700">
                <div className="col-span-2 sm:col-span-1">Roll No</div>
                <div className="col-span-6 sm:col-span-8">Student Name</div>
                <div className="col-span-4 sm:col-span-3">
                  Marks (out of {maxMarks})
                </div>
              </div>

              <div className="max-h-125 overflow-y-auto">
                {searchFilteredStudents.map((student: userData, index: number) => {
                  const studentMark = getStudentMark(student.authId, marks);
                  const isComplete = studentMark !== "";

                  return (
                    <div
                      key={student._id}
                      className={`grid grid-cols-12 gap-4 p-4 sm:p-5 border-b border-slate-700/50 items-center transition-all duration-300 hover:bg-slate-700/20 ${
                        index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/10"
                      }`}
                    >
                      <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 font-bold text-cyan-300">
                          {student.rollNo}
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-8">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${isComplete ? "bg-green-400" : "bg-slate-600"} transition-colors duration-300`}
                          ></div>
                          <span className="text-white font-medium">
                            {student.name}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={studentMark}
                          onChange={(e) =>
                            handleMarkChange(student, Number(e.target.value) || 0, maxMarks, setMarks)
                          }
                          disabled={submitting}
                          placeholder="0"
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-600 text-white font-semibold text-center focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {searchFilteredStudents.length === 0 && (
                <div className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">
                    No students found matching your search
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div
          className="text-center mt-8 animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={handleSubmit}
            disabled={
              marks.length !== filteredStudents.length ||
              filteredStudents.length === 0 ||
              submitting ||
              !selectedSubject ||
              !examDate ||
              !utNo
            }
            className="group relative px-10 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-500 disabled:hover:to-blue-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Marks...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Submit All Marks
                </>
              )}
            </span>
          </button>
          {filteredStudents.length > 0 && marks.length !== filteredStudents.length && (
            <p className="text-sm text-amber-400 mt-3 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Please enter marks for all students before submitting
            </p>
          )}
        </div>
      </div>

      {/* Submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/90 border border-cyan-500/30 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            <p className="text-white font-bold text-xl">
              Submitting Unit Test Marks...
            </p>
            <p className="text-slate-400 text-sm text-center">
              Saving {marks.length} student records for Unit Test {utNo}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(71, 85, 105, 0.1); }
        ::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.5); }
      `}</style>
    </div>
  );
};