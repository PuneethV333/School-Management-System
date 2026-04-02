/* eslint-disable react-hooks/static-components */
import { useState, useMemo, useCallback } from "react";
import { useFetchMe } from "../../../../hooks/useAuth";
import { useFetchExamMarks } from "../../../../hooks/useMarkData";
import Spinner from "../../../../components/Spinner";
import SelectClass from "../../../../components/SelectClass";
import SelectUtType from "../../../../components/SelectUtType";
import SelectSubjectType from "../../../../components/SelectSubject";
import {
  getGrade,
  resolveData,
} from "../../../../utils/resolveUtDataForTeachers";
import {
  BarChart3,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
  Users,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";
import MarkBar from "../../../../components/MarkBar";
import GradePill from "../../../../components/GradePill";

interface ClassMetrics {
  average: number | null;
  highest: number | null;
  lowest: number | null;
  maxMarks: number;
  passCount: number;
  totalWithMarks: number;
  totalStudents: number;
  completionRate: number;
}

interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
}

const TeacherExam = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const [classNo, setClassNo] = useState<number>(1);
  const [utType, setUtType] = useState<"ut-1" | "ut-2" | "ut-3" | "ut-4">(
    "ut-1",
  );
  const [subject, setSubject] = useState<
    | "kannada"
    | "hindi"
    | "social"
    | "science"
    | "maths"
    | "math"
    | "mathematics"
    | "english"
  >("english");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const { data: utData, isPending: loadingMarks } = useFetchExamMarks(
    classNo,
    userData,
  );

  // Memoized data resolution
  const resolvedData = useMemo(() => {
    if (!utData || utData.length === 0) return [];
    return resolveData(utData, subject, utType);
  }, [utData, subject, utType]);

  // Memoized student separation
  const { withMarks, withoutMarks, hasAnyMarks } = useMemo(() => {
    const marked = resolvedData.filter((r) => r.marks !== null);
    const unmarked = resolvedData.filter((r) => r.marks === null);
    return {
      withMarks: marked,
      withoutMarks: unmarked,
      hasAnyMarks: marked.length > 0,
    };
  }, [resolvedData]);

  // Memoized class metrics
  const metrics = useMemo<ClassMetrics>(() => {
    if (!hasAnyMarks) {
      return {
        average: null,
        highest: null,
        lowest: null,
        maxMarks: withMarks[0]?.maxMarks ?? 20,
        passCount: 0,
        totalWithMarks: 0,
        totalStudents: resolvedData.length,
        completionRate: 0,
      };
    }

    const marks = withMarks.map((r) => r.marks!);
    const maxM = withMarks[0]?.maxMarks ?? 20;
    const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const passCount = withMarks.filter(
      (r) => (r.marks! / maxM) * 100 >= 35,
    ).length;
    const completionRate = Math.round(
      (withMarks.length / resolvedData.length) * 100,
    );

    return {
      average: avg,
      highest,
      lowest,
      maxMarks: maxM,
      passCount,
      totalWithMarks: withMarks.length,
      totalStudents: resolvedData.length,
      completionRate,
    };
  }, [hasAnyMarks, withMarks, resolvedData]);

  // Memoized grade distribution
  const gradeDistribution = useMemo<GradeDistribution>(() => {
    const distribution: GradeDistribution = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
    };

    withMarks.forEach((student) => {
      const grade = getGrade(student.marks!, student.maxMarks ?? 20);
      const gradeLabel = grade.label as keyof GradeDistribution;
      distribution[gradeLabel]++;
    });

    return distribution;
  }, [withMarks]);

  // Memoized sorted students
  const sortedStudents = useMemo(() => {
    return [...withMarks].sort((a, b) => (b.marks ?? 0) - (a.marks ?? 0));
  }, [withMarks]);

  const handleStudentToggle = useCallback((authId: string) => {
    setExpandedStudent((prev) => (prev === authId ? null : authId));
  }, []);

  if (loading || loadingMarks) return <Spinner />;

  const Controls = () => (
    <div className="sticky top-0 z-20 backdrop-blur-xl bg-gradient-to-b from-slate-950/95 to-slate-950/80 border-b border-slate-800/60 shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
        <SelectClass classNo={classNo} setClassNo={setClassNo} />
        <SelectUtType dataType={utType} setDataType={setUtType} />
        <SelectSubjectType dataType={subject} setDataType={setSubject} />
      </div>
    </div>
  );

  // Empty state - no data
  if (!utData || utData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Controls />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-24 md:py-32">
          <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm p-8 md:p-12 flex flex-col items-center gap-6 text-center">
            <div className="p-4 bg-slate-800/60 rounded-2xl">
              <BookOpen className="w-8 h-8 text-slate-500" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-slate-200">
                No records for Class {classNo}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Unit test data hasn't been added yet. Check back later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - subject not found
  if (resolvedData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Controls />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-24 md:py-32">
          <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm p-8 md:p-12 flex flex-col items-center gap-6 text-center">
            <div className="p-4 bg-orange-900/20 rounded-2xl border border-orange-500/20">
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-slate-200 capitalize">
                {subject} not found
              </p>
              <p className="text-sm text-slate-500 mt-2">
                This subject isn't taught in Class {classNo}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Controls />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8 relative z-10">
        {/* Header Section */}
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 backdrop-blur-sm shadow-lg shadow-violet-900/10">
                <BarChart3 className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                  Assessment Dashboard
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-300 font-semibold capitalize bg-slate-800/50 px-3 py-1 rounded-lg">
                    {subject}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-semibold bg-slate-800/50 px-3 py-1 rounded-lg uppercase">
                    {utType}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-semibold bg-slate-800/50 px-3 py-1 rounded-lg">
                    Class {classNo}
                  </span>
                </div>
              </div>
            </div>

            {hasAnyMarks && (
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                  Completion Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-violet-400">
                    {metrics.completionRate}%
                  </span>
                  <span className="text-sm text-slate-400">
                    ({metrics.totalWithMarks}/{metrics.totalStudents})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Cards */}
          {hasAnyMarks && metrics.average !== null && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              <MetricCard
                icon={Activity}
                label="Average"
                value={metrics.average.toFixed(1)}
                unit={`/ ${metrics.maxMarks}`}
                color="violet"
                trend="neutral"
              />
              <MetricCard
                icon={Award}
                label="Highest"
                value={String(metrics.highest)}
                unit={`/ ${metrics.maxMarks}`}
                color="emerald"
                trend="up"
              />
              <MetricCard
                icon={AlertCircle}
                label="Lowest"
                value={String(metrics.lowest)}
                unit={`/ ${metrics.maxMarks}`}
                color="orange"
                trend="down"
              />
              <MetricCard
                icon={CheckCircle2}
                label="Passed"
                value={String(metrics.passCount)}
                unit={`/ ${metrics.totalWithMarks}`}
                color="emerald"
                trend="neutral"
              />
              <MetricCard
                icon={Users}
                label="Students"
                value={String(metrics.totalWithMarks)}
                unit={`/ ${metrics.totalStudents}`}
                color="blue"
                trend="neutral"
              />
            </div>
          )}
        </div>

        {/* Grade Distribution */}
        {hasAnyMarks && (
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full" />
                Grade Distribution
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {Object.entries(gradeDistribution).map(([grade, count]) => {
                  const total = withMarks.length;
                  const percentage =
                    total > 0 ? Math.round((count / total) * 100) : 0;
                  const colors: Record<string, string> = {
                    A: "from-emerald-500 to-teal-500",
                    B: "from-blue-500 to-cyan-500",
                    C: "from-yellow-500 to-amber-500",
                    D: "from-orange-500 to-red-500",
                    E: "from-red-500 to-pink-500",
                    F: "from-slate-600 to-slate-700",
                  };

                  return (
                    <div key={grade} className="text-center">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${colors[grade]}/10 border border-slate-700/50 mb-2`}
                      >
                        <p className="text-2xl font-black text-white">
                          {grade}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-slate-200">
                        {count}
                      </p>
                      <p className="text-xs text-slate-500">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Students Table */}
        {resolvedData.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20">
              {/* Table Header */}
              <div className="grid grid-cols-[2rem_1fr_2fr_3rem] md:grid-cols-[2rem_1.5fr_2fr_4rem_3rem] gap-4 px-4 md:px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/40 sticky top-20 z-10">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  #
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Student
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Score
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center hidden md:block">
                  %
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Grade
                </span>
              </div>

              {/* Students with marks */}
              {sortedStudents.map((student, idx) => {
                const grade = getGrade(student.marks!, student.maxMarks ?? 20);
                const percentage = Math.round(
                  ((student.marks ?? 0) / (student.maxMarks ?? 20)) * 100,
                );
                const isExpanded = expandedStudent === student.authId;

                return (
                  <div key={student.authId}>
                    <div
                      onClick={() => handleStudentToggle(student.authId)}
                      className="grid grid-cols-[2rem_1fr_2fr_3rem] md:grid-cols-[2rem_1.5fr_2fr_4rem_3rem] gap-4 items-center px-4 md:px-6 py-4 border-b border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200 group cursor-pointer"
                    >
                      <span className="text-xs text-slate-600 tabular-nums font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-sm md:text-base font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                        {student.name}
                      </span>
                      <MarkBar
                        marks={student.marks!}
                        maxMarks={student.maxMarks ?? 20}
                      />
                      <span className="text-sm font-bold text-violet-400 text-center hidden md:block">
                        {percentage}%
                      </span>
                      <div className="flex justify-center">
                        <GradePill label={grade.label} />
                      </div>
                    </div>

                    {/* Expandable details */}
                    {isExpanded && (
                      <div className="px-4 md:px-6 py-4 bg-slate-800/20 border-b border-slate-700/30">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <DetailItem
                            label="Marks Obtained"
                            value={student.marks ?? 0}
                          />
                          <DetailItem
                            label="Max Marks"
                            value={student.maxMarks ?? 20}
                          />
                          <DetailItem
                            label="Percentage"
                            value={`${percentage}%`}
                          />
                          <DetailItem label="Grade" value={grade.label} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {withoutMarks.length > 0 && (
                <>
                  <div className="px-4 md:px-6 py-3 bg-slate-900/80 border-b border-slate-700/50 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                      Pending Entry ({withoutMarks.length})
                    </span>
                  </div>
                  {withoutMarks.map((student, idx) => (
                    <div
                      key={student.authId}
                      className="grid grid-cols-[2rem_1fr_2fr_3rem] md:grid-cols-[2rem_1.5fr_2fr_4rem_3rem] gap-4 items-center px-4 md:px-6 py-4 border-b border-slate-700/20 opacity-50 hover:opacity-75 transition-opacity"
                    >
                      <span className="text-xs text-slate-600 tabular-nums font-semibold">
                        {withMarks.length + idx + 1}
                      </span>
                      <span className="text-sm md:text-base font-medium text-slate-400 truncate">
                        {student.name}
                      </span>
                      <span className="text-xs text-slate-600 italic">
                        Not entered
                      </span>
                      <span className="text-center text-slate-600 text-sm hidden md:block">
                        —
                      </span>
                      <span className="text-center text-slate-700 text-xs">
                        —
                      </span>
                    </div>
                  ))}
                </>
              )}

              {/* Footer */}
              {hasAnyMarks && (
                <div className="px-4 md:px-6 py-4 bg-slate-900/60 border-t border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    {metrics.totalWithMarks} of {metrics.totalStudents} marks
                    recorded
                  </span>
                  <span>
                    Class Average:{" "}
                    <span className="font-bold text-violet-400 text-sm">
                      {metrics.average?.toFixed(1)}
                    </span>
                    <span className="text-slate-700">
                      {" "}
                      / {metrics.maxMarks}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Warning - No marks entered */}
        {!hasAnyMarks && resolvedData.length > 0 && (
          <div className="rounded-2xl border border-amber-800/30 bg-gradient-to-r from-amber-950/40 to-orange-950/40 px-6 py-5 flex items-start gap-4 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm md:text-base text-amber-300/90 font-semibold">
                Marks not entered yet
              </p>
              <p className="text-xs md:text-sm text-amber-200/70 mt-1">
                Marks for{" "}
                <span className="font-semibold capitalize">{subject}</span>{" "}
                <span className="uppercase">{utType}</span> are pending. Start
                recording student marks to see analytics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  unit: string;
  color: "violet" | "emerald" | "orange" | "blue";
  trend?: "up" | "down" | "neutral";
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
  color,
  trend,
}: MetricCardProps) => {
  const colorMap = {
    violet:
      "from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400",
    emerald:
      "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    orange:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
  };

  return (
    <div
      className={`rounded-xl border p-4 bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm hover:border-opacity-60 transition-all group`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
        {trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
      </div>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl md:text-3xl font-black text-white">
          {value}
        </span>
        <span className="text-xs text-slate-600">{unit}</span>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string | number;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div>
    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-base md:text-lg font-bold text-slate-200">{value}</p>
  </div>
);

export default TeacherExam;
