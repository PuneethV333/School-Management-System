/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import { useFetchMe } from "../../../../hooks/useAuth";
import { useFetchUtMarks } from "../../../../hooks/useMarkData";
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
} from "lucide-react";
import MarkBar from "../../../../components/MarkBar";
import GradePill from "../../../../components/GradePill";

const TeacherUt = () => {
  const { data: userData, isPending: loading } = useFetchMe();
  const [classNo, setClassNo] = useState<number>(1);
  const { data: utData, isPending: loadingMarks } = useFetchUtMarks(
    classNo,
    userData,
  );
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

  if (loading || loadingMarks) return <Spinner />;

  const Controls = () => (
    <div className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
        <SelectClass classNo={classNo} setClassNo={setClassNo} />
        <SelectUtType dataType={utType} setDataType={setUtType} />
        <SelectSubjectType dataType={subject} setDataType={setSubject} />
      </div>
    </div>
  );

  if (!utData || utData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 font-[system-ui]">
        <Controls />
        <div className="max-w-5xl mx-auto px-6 py-32 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-200">
              No records for Class {classNo}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Unit test data hasn't been added yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const res = resolveData(utData, subject, utType);
  const withMarks = res.filter((r) => r.marks !== null);
  const withoutMarks = res.filter((r) => r.marks === null);
  const hasAnyMarks = withMarks.length > 0;

  const avg = hasAnyMarks
    ? withMarks.reduce((a, b) => a + (b.marks ?? 0), 0) / withMarks.length
    : null;
  const highest = hasAnyMarks
    ? Math.max(...withMarks.map((r) => r.marks!))
    : null;
  const lowest = hasAnyMarks
    ? Math.min(...withMarks.map((r) => r.marks!))
    : null;
  const maxM = withMarks[0]?.maxMarks ?? 20;
  const passCount = withMarks.filter(
    (r) => (r.marks! / (r.maxMarks ?? 20)) * 100 >= 35,
  ).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Controls />

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-900/40">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Unit Tests
              </h1>
              <p className="text-sm text-slate-400 mt-0.5 capitalize">
                <span className="text-slate-300 font-medium">{subject}</span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="text-slate-300 font-medium uppercase">
                  {utType}
                </span>
                <span className="mx-1.5 text-slate-600">·</span>
                Class {classNo}
              </p>
            </div>
          </div>

          {hasAnyMarks && (
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">
                Completion
              </p>
              <p className="text-sm font-bold text-slate-200">
                {withMarks.length}
                <span className="text-slate-500 font-normal">
                  /{res.length} students
                </span>
              </p>
            </div>
          )}
        </div>

        {hasAnyMarks && avg !== null && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: TrendingUp,
                label: "Average",
                value: avg.toFixed(1),
                sub: `/ ${maxM}`,
                accent: "text-violet-300",
                bg: "bg-violet-500/8 border-violet-500/20",
              },
              {
                icon: Award,
                label: "Highest",
                value: String(highest),
                sub: `/ ${maxM}`,
                accent: "text-emerald-300",
                bg: "bg-emerald-500/8 border-emerald-500/20",
              },
              {
                icon: AlertCircle,
                label: "Lowest",
                value: String(lowest),
                sub: `/ ${maxM}`,
                accent: "text-orange-300",
                bg: "bg-orange-500/8 border-orange-500/20",
              },
              {
                icon: BookOpen,
                label: "Passed",
                value: String(passCount),
                sub: `/ ${withMarks.length}`,
                accent: "text-sky-300",
                bg: "bg-sky-500/8 border-sky-500/20",
              },
            ].map(({ icon: Icon, label, value, sub, accent, bg }) => (
              <div
                key={label}
                className={`rounded-2xl border p-4 ${bg} flex flex-col gap-2`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${accent}`} />
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${accent}`}>
                    {value}
                  </span>
                  <span className="text-xs text-slate-600">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {res.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col items-center gap-4 py-24 text-center">
            <BookOpen className="w-10 h-10 text-slate-600" />
            <div>
              <p className="text-lg font-bold text-slate-300 capitalize">
                {subject} not found
              </p>
              <p className="text-sm text-slate-500 mt-1">
                This subject isn't taught in Class {classNo}.
              </p>
            </div>
          </div>
        )}

        {res.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
            <div className="grid grid-cols-[2rem_1fr_2fr_3rem] gap-4 px-6 py-3 border-b border-slate-800 bg-slate-900/60">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                #
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Student
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Score
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                Grade
              </span>
            </div>

            {withMarks.map((student, idx) => {
              const grade = getGrade(student.marks!, student.maxMarks ?? 20);
              return (
                <div
                  key={student.authId}
                  className="grid grid-cols-[2rem_1fr_2fr_3rem] gap-4 items-center px-6 py-3.5 border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors duration-150 group"
                >
                  <span className="text-xs text-slate-600 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {student.name}
                  </span>
                  <MarkBar
                    marks={student.marks!}
                    maxMarks={student.maxMarks ?? 20}
                  />
                  <div className="flex justify-center">
                    <GradePill label={grade.label} />
                  </div>
                </div>
              );
            })}

            {withoutMarks.length > 0 && (
              <>
                <div className="px-6 py-2 bg-slate-900/80 border-b border-slate-800/40 flex items-center gap-2">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-xs text-slate-600 uppercase tracking-widest">
                    Pending ({withoutMarks.length})
                  </span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>
                {withoutMarks.map((student, idx) => (
                  <div
                    key={student.authId}
                    className="grid grid-cols-[2rem_1fr_2fr_3rem] gap-4 items-center px-6 py-3.5 border-b border-slate-800/30 opacity-40"
                  >
                    <span className="text-xs text-slate-600 tabular-nums">
                      {withMarks.length + idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-400 truncate">
                      {student.name}
                    </span>
                    <span className="text-xs text-slate-600 italic">
                      Not entered
                    </span>
                    <span className="text-center text-slate-700 text-xs">
                      —
                    </span>
                  </div>
                ))}
              </>
            )}

            {hasAnyMarks && (
              <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  {withMarks.length} of {res.length} recorded
                </span>
                {avg !== null && (
                  <span className="text-xs text-slate-500">
                    Class avg:{" "}
                    <span className="font-bold text-violet-400">
                      {avg.toFixed(1)}
                    </span>
                    <span className="text-slate-700"> / {maxM}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {!hasAnyMarks && res.length > 0 && (
          <div className="rounded-2xl border border-amber-800/30 bg-amber-950/20 px-6 py-5 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-300/80">
              Marks for{" "}
              <span className="font-semibold capitalize">{subject}</span>{" "}
              <span className="uppercase">{utType}</span> haven't been entered
              yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherUt;
