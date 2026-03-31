/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, Zap } from "lucide-react";
import { useFetchMe } from "../../../hooks/useAuth";
import { useFetchUtMarks } from "../../../hooks/useMarkData";
import SelectClass from "../../../components/SelectClass";
import Spinner from "../../../components/Spinner";
import type { UtResult } from "../../../types/ut.types";
import {
  formatDate,
  getPercentage,
  getScoreColor,
} from "../../../utils/viewUtHelpers";

const Ut = () => {
  const { data: userData, isLoading: isLoadingUser } = useFetchMe();
  const [classNo, setClassNo] = useState<number>(1);

  useEffect(() => {
    if (userData?.role === "student") {
      const studentClass = Number((userData as { class?: number }).class);
      setClassNo(Number.isNaN(studentClass) ? 1 : studentClass);
    }
  }, [userData]);

  const { data: utData, isLoading: isLoadingUtData } = useFetchUtMarks(
    classNo,
    userData ?? { authId: "" },
  );

  const studentData = useMemo<UtResult | null>(() => {
    if (!utData) return null;
    return Array.isArray(utData) ? (utData[0] ?? null) : utData;
  }, [utData]);

  console.log(utData);

  if (isLoadingUser || isLoadingUtData) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
              Unit Tests
            </h1>
            <p className="text-slate-400">Detailed Performance Analysis</p>
          </div>
        </div>

        {userData?.role !== "student" && (
          <div className="mb-8">
            <SelectClass classNo={classNo} setClassNo={setClassNo} />
          </div>
        )}

        {studentData?.subjects?.length ? (
          <div className="space-y-10">
            {studentData.subjects.map((subject) => {
              const totalMarks = subject.assessments.reduce(
                (sum, t) => sum + t.marksObtained,
                0,
              );

              const maxMarks = subject.assessments.reduce(
                (sum, t) => sum + t.maxMarks,
                0,
              );

              const percentage = getPercentage(totalMarks, maxMarks);

              return (
                <div key={subject.subject}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black text-white">
                      {subject.subject}
                    </h2>
                    <span className="text-xl font-black text-purple-400">
                      {percentage}%
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800/40">
                    <table className="w-full">
                      <thead className="bg-slate-700/40">
                        <tr>
                          <th className="px-6 py-4 text-left">Test</th>
                          <th className="px-6 py-4 text-center">Marks</th>
                          <th className="px-6 py-4 text-center">Max</th>
                          <th className="px-6 py-4 text-center">Score</th>
                          <th className="px-6 py-4 text-right">Date</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-700/30">
                        {subject.assessments.map((test) => {
                          const percentagePerTest = getPercentage(
                            test.marksObtained,
                            test.maxMarks,
                          );

                          return (
                            <tr
                              key={
                                test._id ?? `${subject.subject}-${test.name}`
                              }
                            >
                              <td className="px-6 py-4 font-bold text-white">
                                {test.name}
                              </td>

                              <td className="px-6 py-4 text-center text-emerald-400 font-black">
                                {test.marksObtained}
                              </td>

                              <td className="px-6 py-4 text-center text-slate-200">
                                {test.maxMarks}
                              </td>

                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`px-3 py-1 rounded-lg font-bold ${getScoreColor(
                                    percentagePerTest,
                                  )}`}
                                >
                                  <Zap className="inline w-3 h-3 mr-1" />
                                  {percentagePerTest}%
                                </span>
                              </td>

                              <td className="px-6 py-4 text-right text-slate-400">
                                {formatDate(test.examDate)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-200">
              No Unit Tests Found
            </h2>
            <p className="text-slate-400">Results will appear once published</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ut;
