import { GraduationCap, UsersRound, IdCard } from "lucide-react";
import CountCard from "../../components/CountCard";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Welcome back! Here's an overview of your school's performance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <CountCard icon={GraduationCap} title="Total Students" count={100} />
          <CountCard icon={UsersRound} title="Total Teachers" count={100} />
          <CountCard icon={IdCard} title="Total Employees" count={100} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
