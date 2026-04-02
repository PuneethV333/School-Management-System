/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart3, BookOpen, Zap, TrendingUp, Award, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useFetchMe } from "../../../../hooks/useAuth";
import { useFetchExamMarks } from "../../../../hooks/useMarkData";
import Spinner from "../../../../components/Spinner";
import {
  formatDate,
  getPercentage,
  getScoreColor,
} from "../../../../utils/viewUtHelpers";
import type { Subject, Assessment } from "../../../../types/students.types";

interface SubjectStats {
  subjectName: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  trend: "improving" | "declining" | "stable";
  latestScore: number;
}

const StudentExam = () => {
  const { data: userData, isLoading: isLoadingUser } = useFetchMe();

  const classNo =
    typeof userData?.class === "number"
      ? userData.class
      : Number(userData?.class);

  const { data: studentData, isLoading: isLoadingUtData } =
    useFetchExamMarks(classNo, userData);

  const record = useMemo(() => {
    if (!studentData) return null;
    return Array.isArray(studentData) ? studentData[0] : studentData;
  }, [studentData]);

  const subjects: Subject[] = useMemo(() => record?.subjects ?? [], [record]);

  const subjectStats = useMemo<SubjectStats[]>(() => {
    return subjects.map((subject) => {
      const totalMarks = subject.assessments.reduce(
        (sum: number, t: Assessment) => sum + t.marksObtained,
        0
      );

      const maxMarks = subject.assessments.reduce(
        (sum: number, t: Assessment) => sum + t.maxMarks,
        0
      );

      const percentage = getPercentage(totalMarks, maxMarks);
      const latestScore = subject.assessments[subject.assessments.length - 1]?.marksObtained || 0;

      // Calculate trend (comparing last 3 assessments)
      const lastThree = subject.assessments.slice(-3);
      const avgFirstTwo = (lastThree[0]?.marksObtained ?? 0) / (lastThree[0]?.maxMarks ?? 1);
      const avgLast = (lastThree[2]?.marksObtained ?? 0) / (lastThree[2]?.maxMarks ?? 1);
      const trend = avgLast > avgFirstTwo * 1.05 ? "improving" : avgLast < avgFirstTwo * 0.95 ? "declining" : "stable";

      return {
        subjectName: subject.subject,
        totalMarks,
        maxMarks,
        percentage,
        trend,
        latestScore,
      };
    });
  }, [subjects]);

  const overallStats = useMemo(() => {
    const totalAllMarks = subjectStats.reduce((sum, s) => sum + s.totalMarks, 0);
    const totalMaxMarks = subjectStats.reduce((sum, s) => sum + s.maxMarks, 0);
    const overallPercentage = getPercentage(totalAllMarks, totalMaxMarks);
    const improvingSubjects = subjectStats.filter(s => s.trend === "improving").length;

    return { totalAllMarks, totalMaxMarks, overallPercentage, improvingSubjects };
  }, [subjectStats]);

  if (isLoadingUser || isLoadingUtData) {
    return <Spinner />;
  }

  if (!userData || !classNo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-400 text-lg">Invalid user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text mb-2">
                Academic Performance
              </h1>
              <p className="text-slate-400 text-sm md:text-base">Comprehensive assessment tracking for {userData?.class ? `Class ${userData.class}` : 'your class'}</p>
            </div>
          </div>

          {/* Overall Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Overall Score"
              value={`${overallStats.overallPercentage}%`}
              trend={overallStats.improvingSubjects > 0 ? "up" : "stable"}
            />
            <StatCard
              icon={<Award className="w-5 h-5" />}
              label="Total Marks"
              value={`${overallStats.totalAllMarks}/${overallStats.totalMaxMarks}`}
              trend="neutral"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Improving Subjects"
              value={`${overallStats.improvingSubjects}/${subjectStats.length}`}
              trend="neutral"
            />
          </div>
        </div>

        {/* Subjects Section */}
        {subjects.length ? (
          <div className="space-y-8">
            {subjectStats.map((stats, idx) => {
              const subject = subjects.find(s => s.subject === stats.subjectName)!;
              
              return (
                <div key={stats.subjectName} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* Subject Header */}
                  <div className="flex justify-between items-center mb-4 group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-8 rounded-full transition-all group-hover:h-10 ${getTrendColor(stats.trend)}`} />
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-purple-300 transition-colors">
                          {stats.subjectName}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">{subject.assessments.length} assessments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        {stats.percentage}%
                      </div>
                      <TrendIndicator trend={stats.trend} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6 space-y-2">
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(stats.percentage)}`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{stats.totalMarks} marks obtained</span>
                      <span>{stats.maxMarks} total marks</span>
                    </div>
                  </div>

                  {/* Assessment Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700/30 bg-slate-700/20">
                          <th className="px-4 md:px-6 py-4 text-left font-bold text-slate-200">Assessment</th>
                          <th className="px-4 md:px-6 py-4 text-center font-bold text-slate-200">Marks</th>
                          <th className="px-4 md:px-6 py-4 text-center font-bold text-slate-200">Max</th>
                          <th className="px-4 md:px-6 py-4 text-center font-bold text-slate-200">Performance</th>
                          <th className="px-4 md:px-6 py-4 text-right font-bold text-slate-200">Date</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-700/20">
                        {subject.assessments.map((test: Assessment, assessIdx: number) => {
                          const percentagePerTest = getPercentage(test.marksObtained, test.maxMarks);
                          const isLatest = assessIdx === subject.assessments.length - 1;

                          return (
                            <tr
                              key={test._id ?? `${stats.subjectName}-${test.name}`}
                              className={`transition-colors hover:bg-slate-700/20 ${isLatest ? "bg-purple-900/20" : ""}`}
                            >
                              <td className="px-4 md:px-6 py-4 font-semibold text-white">
                                <span className="flex items-center gap-2">
                                  {test.name}
                                  {isLatest && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                                      Latest
                                    </span>
                                  )}
                                </span>
                              </td>

                              <td className="px-4 md:px-6 py-4 text-center font-black text-emerald-400">
                                {test.marksObtained}
                              </td>

                              <td className="px-4 md:px-6 py-4 text-center text-slate-300 font-semibold">
                                {test.maxMarks}
                              </td>

                              <td className="px-4 md:px-6 py-4 text-center">
                                <span
                                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 w-fit mx-auto ${getScoreColor(percentagePerTest)}`}
                                >
                                  <Zap className="w-3 h-3" />
                                  {percentagePerTest}%
                                </span>
                              </td>

                              <td className="px-4 md:px-6 py-4 text-right text-slate-400 text-xs">
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
            <div className="mb-6">
              <BookOpen className="w-20 h-20 text-slate-600 mx-auto mb-4 opacity-50" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-2">
              No Assessments Yet
            </h2>
            <p className="text-slate-500">Assessment results will appear once they are published</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: "up" | "down" | "stable" | "neutral";
}

const StatCard = ({ icon, label, value, trend }: StatCardProps) => (
  <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm hover:border-purple-500/30 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30 transition-colors">
        {icon}
      </div>
      {trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
    </div>
    <p className="text-sm text-slate-400 mb-1">{label}</p>
    <p className="text-2xl font-black text-white">{value}</p>
  </div>
);

const TrendIndicator = ({ trend }: { trend: string }) => {
  const colors = {
    improving: "text-green-400",
    declining: "text-red-400",
    stable: "text-blue-400",
  };

  const labels = {
    improving: "📈 Improving",
    declining: "📉 Needs Focus",
    stable: "➡️ Steady",
  };

  return (
    <p className={`text-xs font-bold mt-1 ${colors[trend as keyof typeof colors]}`}>
      {labels[trend as keyof typeof labels]}
    </p>
  );
};

const getTrendColor = (trend: string) => {
  const colors = {
    improving: "bg-green-500",
    declining: "bg-red-500",
    stable: "bg-blue-500",
  };
  return colors[trend as keyof typeof colors] || "bg-slate-500";
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "bg-gradient-to-r from-green-500 to-emerald-400";
  if (percentage >= 75) return "bg-gradient-to-r from-blue-500 to-cyan-400";
  if (percentage >= 60) return "bg-gradient-to-r from-yellow-500 to-orange-400";
  return "bg-gradient-to-r from-red-500 to-pink-400";
};

export default StudentExam;