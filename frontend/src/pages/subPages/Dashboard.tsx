// import { useState } from "react";
// import useIsMobile from "../../hooks/useIsMobile";

const Dashboard = () => {
//   const _isMobile = useIsMobile();
//   const [isMobile, setIsMobile] = useState<boolean>(_isMobile);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Welcome back! Here's an overview of your school's performance
              </p>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default Dashboard;
