/* eslint-disable react-hooks/set-state-in-effect */
import { GraduationCap, UsersRound, IdCard } from "lucide-react";
import CountCard from "../../components/CountCard";
import { useFetchMe } from "../../hooks/useAuth";
import { useFetchSchoolData } from "../../hooks/useSchoolData";
import Spinner from "../../components/Spinner";
import ShowTodaysClassInDashboard from "../../components/ShowTodaysClassInDashboard";
import type { showTodaysClassesProps } from "../../types/showTodaysClasses.types";
import { useFetchTimeTable } from "../../hooks/useAcademicData";
import { useState, useEffect } from "react";
import { useFetchClassAttendance } from "../../hooks/useAttendanceData";
import {
  /*returnMonthsData,*/ type returnType,
} from "../../utils/returnMonthsData";
// import { resolveClassAttendance } from "../../utils/resolveClassAttendance";
import SelectClass from "../../components/SelectClass";
import SelectType from "../../components/SelectType";
import { Dashboard as AnnouncementForDashboard } from "./Announcement/Dashboard";
// import { useFetchExamMarks } from "../../hooks/useMarkData";
// import { processWeeklyData } from "../../utils/processWeekLyData";
// import { sortAttendanceData } from "../../utils/sort";

const Dashboard = () => {
  const { data: userData } = useFetchMe();
  const { data: schoolData, isPending: loading } = useFetchSchoolData(userData);

  const [classNo, setClassNo] = useState<number>(1);
  const [classNoForGraph, setClassNoForGraph] = useState<number>(1);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [dataType, setDataType] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    if (userData?.role === "student") {
      setIsStudent(true);
      setClassNo(userData?.class);
    }
  }, [userData]);

  const { data: timetable, isPending: loadingTimetable } = useFetchTimeTable(
    userData,
    classNo,
  );

  const { data: classAttendance, isPending: loadingClassAttendance } =
    useFetchClassAttendance(userData, classNoForGraph);

  classAttendance?.months?.sort(
    (a: returnType, b: returnType) => a.monthNumber - b.monthNumber,
  );

  const dayIndex = new Date().getDay();
  const mappedIndex = dayIndex === 0 ? 0 : dayIndex - 1;

  const todaysTimeTable: showTodaysClassesProps[] =
    timetable?.[mappedIndex]?.periods || [];

  if (loading || loadingTimetable || loadingClassAttendance) return <Spinner />;

  console.log(classAttendance);

  //   const thisMonthsClassAttendance = returnMonthsData(classAttendance.months);
  //   const todaysClassAttendance = resolveClassAttendance(
  //     thisMonthsClassAttendance?.weeks ?? [],
  //   );

  //   const res = processWeeklyData(thisMonthsClassAttendance,new Date(),classAttendance.totalStudents)

  // console.log(res)

  //   console.log(`todaysClassAttendance:${todaysClassAttendance}`);

  // var inputObj:dashboardGraphInputProps = {

  // }

  //   console.log(todaysClassAttendance?.days[0].presentCount === null ? 0 : 100);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Welcome back! Here's an overview of your school's performance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8">
          <CountCard
            icon={GraduationCap}
            title="Total Students"
            count={schoolData?.totNoOfStudents}
          />
          <CountCard
            icon={UsersRound}
            title="Total Teachers"
            count={schoolData?.totNoOfTeachers}
          />
          <CountCard
            icon={IdCard}
            title="Total Employees"
            count={schoolData?.totNoOfTeachers}
          />
        </div>
        
        
         <div
          className="mb-10 sm:mb-14 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <AnnouncementForDashboard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-black/30">
            <div className="mb-4 flex justify-between ">
              <SelectType dataType={dataType} setDataType={setDataType} />

              <SelectClass classNo={classNoForGraph} setClassNo={setClassNoForGraph} />
            </div>
          </div>

          <div className="lg:col-span-1 bg-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-black/30">
            {!isStudent && (
              <div className="mb-4">
                <SelectClass classNo={classNo} setClassNo={setClassNo} />
              </div>
            )}
            <ShowTodaysClassInDashboard classes={todaysTimeTable} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
