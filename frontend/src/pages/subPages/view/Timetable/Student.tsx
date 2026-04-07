import { useState } from "react";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";
import { useFetchMe } from "../../../../hooks/useAuth";
import { useFetchTimeTable } from "../../../../hooks/useAcademicData";
import Spinner from "../../../../components/Spinner";
import type { DaySchedule, Period } from "../../../../types/timetable.types";

export const Student = () => {
    const {data:userData,isPending:loading} = useFetchMe()
    
    const classNo =
    typeof userData?.class === "number"
      ? userData.class
      : Number(userData?.class);
      
      const [selectedDay, setSelectedDay] = useState<string>("Monday");
      
      const {data:timeTable,isPending:loadingTimeTableData} = useFetchTimeTable(userData,classNo)
      
      
      if(loading || loadingTimeTableData){
        return <Spinner/>
      }
      
      
      const timetableData: DaySchedule[] = timeTable || [];
        const days = timetableData.map((d) => d.day);
        const currentDayData = timetableData.find((d) => d.day === selectedDay);
      
        const getBreakInfo = (period: Period, index: number) => {
          if (index === 0) return null;
          const prevPeriod = currentDayData?.periods[index - 1];
          if (!prevPeriod) return null;
      
          const prevEnd = prevPeriod.endTime;
          const currentStart = period.startTime;
      
          if (prevEnd !== currentStart) {
            const breakDuration = calculateDuration(prevEnd, currentStart);
            return { start: prevEnd, end: currentStart, duration: breakDuration };
          }
          return null;
        };
      
        const calculateDuration = (start: string, end: string) => {
          const [startHour, startMin] = start.split(":").map(Number);
          const [endHour, endMin] = end.split(":").map(Number);
          const minutes = endHour * 60 + endMin - (startHour * 60 + startMin);
          return minutes;
        };
      
    
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Class Timetable
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                View and manage class schedules
              </p>
            </div>
          </div>
        </div>


        {/* Day Tabs */}
        <div className="mb-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                  selectedDay === day
                    ? "bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Period Count Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
            {currentDayData?.periods.length || 0}{" "}
            {currentDayData?.periods.length === 1 ? "Period" : "Periods"}
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-200">
                {selectedDay}'s Schedule
              </h2>
            </div>

            <div className="space-y-3">
              {currentDayData?.periods.map((period, index) => {
                const breakInfo = getBreakInfo(period, index);
                return (
                  <div key={period.periodNumber}>
                    {/* Break Indicator */}
                    {breakInfo && (
                      <div className="flex items-center gap-3 py-3 px-4 bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl mb-3 backdrop-blur-sm">
                        <div className="shrink-0">
                          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-300">
                            {breakInfo.duration >= 30 ? "Lunch Break" : "Break"}
                          </p>
                          <p className="text-xs text-amber-400/80">
                            {breakInfo.start} - {breakInfo.end} (
                            {breakInfo.duration} mins)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Period Card */}
                    <div className="flex items-center gap-4 p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl hover:bg-slate-700/40 hover:border-blue-500/50 transition-all duration-300 group">
                      {/* Period Number */}
                      <div className="shrink-0 w-14 h-14 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:border-blue-400/50 transition-all">
                        <span className="text-xl font-black bg-linear-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {period.periodNumber}
                        </span>
                      </div>

                      {/* Subject & Time */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-base font-bold text-slate-200 truncate">
                            {period.subject}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm text-slate-400">
                            {period.startTime} - {period.endTime}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                            45 mins
                          </span>
                        </div>
                      </div>

                      {/* Teacher Badge */}
                      <div className="hidden sm:flex shrink-0 items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-300">
                          ID: {period.teacher.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Total Periods
                  </p>
                  <p className="text-3xl font-black bg-linear-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {currentDayData?.periods.length || 0}
                  </p>
                </div>
                <div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
                    Start Time
                  </p>
                  <p className="text-3xl font-black bg-linear-to-br from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {currentDayData?.periods[0]?.startTime || "-"}
                  </p>
                </div>
                <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                    End Time
                  </p>
                  <p className="text-3xl font-black bg-linear-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {currentDayData?.periods[
                      currentDayData.periods.length - 1
                    ]?.endTime || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-200">
                Weekly Overview
              </h2>
            </div>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-linear-to-r from-blue-900/40 to-cyan-900/40 border-b border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Periods
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Start
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      End
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {timetableData.map((dayData) => (
                    <tr
                      key={dayData.day}
                      className={`hover:bg-slate-700/30 transition-colors duration-300 cursor-pointer ${
                        selectedDay === dayData.day
                          ? "bg-blue-500/10"
                          : "bg-slate-800/20"
                      }`}
                      onClick={() => setSelectedDay(dayData.day)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-200">
                        {dayData.day}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                        {dayData.periods.length} periods
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                        {dayData.periods[0]?.startTime}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                        {dayData.periods[dayData.periods.length - 1]?.endTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        
        {currentDayData && currentDayData.periods.length > 0 && (
          <div className="mt-8 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 font-semibold">
              💡 Tip: Click on any day in the weekly overview to view its detailed schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


