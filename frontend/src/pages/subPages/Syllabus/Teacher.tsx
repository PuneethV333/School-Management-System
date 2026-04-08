/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useFetchMe } from "../../../hooks/useAuth";
import { useFetchSyllabus } from "../../../hooks/useAcademicData";
import Spinner from "../../../components/Spinner";
import { BookOpen, ChevronRight } from "lucide-react";
import SelectClass from "../../../components/SelectClass";

const Teacher = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const [classNo, setClassNo] = useState<number>(1);
  const { data: syllabusData, isPending: loadingSyllabus } = useFetchSyllabus(
    userData,
    classNo,
  );
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);

  if (loading || loadingSyllabus) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Syllabus
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Class {classNo} - Complete Course Curriculum
              </p>
            </div>
          </div>
        </div>

        <SelectClass classNo={classNo} setClassNo={setClassNo} />

        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-300 font-medium mt-4">
              Loading syllabus...
            </p>
          </div>
        )}

        {!loading && syllabusData && syllabusData.syllabus?.length > 0 ? (
          <div className="space-y-4">
            {syllabusData.syllabus.map((subjectItem: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setExpandedSubject(expandedSubject === idx ? null : idx)
                  }
                  className="w-full"
                >
                  <div className="p-6 flex items-center justify-between hover:bg-slate-700/10 transition-colors duration-300">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">
                          {subjectItem.subject}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                          {subjectItem.title}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-6 h-6 text-slate-400 transition-transform duration-300 shrink-0 ${
                        expandedSubject === idx ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {expandedSubject === idx && (
                  <div className="border-t border-slate-700/50 px-6 py-4">
                    <div className="space-y-3">
                      {subjectItem.lessons.map((lesson: any) => (
                        <div
                          key={lesson.unitNo}
                          className="p-4 bg-slate-800/60 rounded-lg hover:bg-slate-700/40 transition-colors duration-300 border border-slate-700/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-md whitespace-nowrap">
                              Unit {lesson.unitNo}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg mb-1">
                                {lesson.unitName}
                              </h3>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {lesson.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-6">
                <BookOpen className="w-10 h-10 text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-2">
                No Syllabus Found
              </h2>
              <p className="text-slate-400">
                Syllabus for Class {classNo} is not available yet
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Teacher;
