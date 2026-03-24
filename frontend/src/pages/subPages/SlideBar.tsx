import { NavLink } from "react-router-dom";
import {
  Users,
  Calendar,
  BookOpen,
  Trophy,
  Bell as AnnouncementIcon,
  LayoutDashboard,
  UserCheck,
  PlusCircle,
} from "lucide-react";

import useIsMobile from "../../hooks/useIsMobile";
import useUi from "../../hooks/useUi";
import { useFetchMe } from "../../hooks/useAuth";
import type { MenuConfig, MenuItem } from "../../types/slideBar.types";

const menuConfig: MenuConfig = {
  student: {
    GENERAL: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "My Attendance", path: "/attendance", icon: Calendar },
      { name: "Syllabus", path: "/syllabus", icon: BookOpen },
      { name: "Timetable", path: "/timetable", icon: Calendar },
      { name: "Announcements", path: "/announcements", icon: AnnouncementIcon },
    ],
    RESULTS: [
      { name: "Unit Test Results", path: "/results/unit-tests", icon: Trophy },
      { name: "Exam Results", path: "/results/exams", icon: Trophy },
    ],
  },

  teacher: {
    GENERAL: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Students", path: "/students", icon: Users },
      { name: "My Attendance", path: "/attendance", icon: Calendar },
      {
        name: "Mark Attendance",
        path: "/mark/attendance/students",
        icon: UserCheck,
      },
      { name: "Announcements", path: "/announcements", icon: AnnouncementIcon },
    ],
    "ADD MARKS": [
      {
        name: "Add Unit Test Marks",
        path: "/marks/unit-tests",
        icon: PlusCircle,
      },
      { name: "Add Exam Marks", path: "/marks/exams", icon: PlusCircle },
    ],
    RESULTS: [
      { name: "Unit Test Results", path: "/results/unit-tests", icon: Trophy },
      { name: "Exam Results", path: "/results/exams", icon: Trophy },
    ],
  },

  authority: {
    GENERAL: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Students", path: "/students", icon: Users },
      { name: "Teachers", path: "/teachers", icon: Users },
      {
        name: "Mark Student Attendance",
        path: "/mark/attendance/students",
        icon: UserCheck,
      },
      {
        name: "Mark Teacher Attendance",
        path: "/mark/attendance/teachers",
        icon: UserCheck,
      },
      { name: "Add New Student", path: "/add/student", icon: PlusCircle },
      { name: "Add New Teacher", path: "/add/teacher", icon: PlusCircle },
    ],
    "ADD MARKS": [
      {
        name: "Add Unit Test Marks",
        path: "/marks/unit-tests",
        icon: PlusCircle,
      },
      { name: "Add Exam Marks", path: "/marks/exams", icon: PlusCircle },
    ],
    RESULTS: [
      { name: "Unit Test Results", path: "/results/unit-tests", icon: Trophy },
      { name: "Exam Results", path: "/results/exams", icon: Trophy },
    ],
    MANAGE: [
      {
        name: "Add Announcement",
        path: "/announcements/new",
        icon: PlusCircle,
      },
      { name: "Announcements", path: "/announcements", icon: AnnouncementIcon },
      { name: "Syllabus", path: "/syllabus", icon: BookOpen },
      { name: "Timetable", path: "/timetable", icon: Calendar },
    ],
  },
};

const MenuBar = () => {
  const { setMenuIsOpen } = useUi();
  const isMobile = useIsMobile();
  const { data: userData } = useFetchMe();

  const role: "authority" | "student" | "teacher" | undefined = userData?.role;

  const sections: Record<string, MenuItem[]> = (role && menuConfig[role]) || {};

  return (
    <aside className="w-60 h-screen bg-linear-to-b from-[#0A0F1C] to-[#111827] text-white flex flex-col shadow-lg">
      <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        {Object.entries(sections).map(([group, items]) => (
          <div key={group} className="mb-4">
            {group !== "GENERAL" && (
              <p className="px-6 mb-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                {group}
              </p>
            )}

            {items.map((item: MenuItem) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => isMobile && setMenuIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-3 text-sm font-semibold transition-all rounded-r-md mb-1
                    ${
                      isActive
                        ? "bg-blue-600/20 text-white shadow-inner"
                        : "text-gray-300 hover:bg-blue-500/10 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-blue-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-blue-600 text-xs text-gray-400 shrink-0">
        © 2026 School System
      </div>
    </aside>
  );
};

export default MenuBar;
