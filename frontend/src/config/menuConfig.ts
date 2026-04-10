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
import type { MenuConfig } from "../types/slideBar.types";

export const menuConfig: MenuConfig = {
    student: {
        GENERAL: [
            { name: "Dashboard", path: "/", icon: LayoutDashboard },
            { name: "My Attendance", path: "/my/attendance", icon: Calendar },
            { name: "Syllabus", path: "/syllabus", icon: BookOpen },
            { name: "Timetable", path: "/timetable", icon: Calendar },
            { name: "Announcements", path: "/announcements", icon: AnnouncementIcon },
        ],
        RESULTS: [
            { name: "Unit Test Results", path: "/marks/ut", icon: Trophy },
            { name: "Exam Results", path: "/marks/exam", icon: Trophy },
        ],
    },

    teacher: {
        GENERAL: [
            { name: "Dashboard", path: "/", icon: LayoutDashboard },
            { name: "Students", path: "/view/students", icon: Users },
            { name: "My Attendance", path: "/my/attendance", icon: Calendar },
            {
                name: "Mark Attendance",
                path: "/students/mark/attendance",
                icon: UserCheck,
            },
            { name: "Announcements", path: "/announcements", icon: AnnouncementIcon },
        ],
        "ADD MARKS": [
            {
                name: "Add Unit Test Marks",
                path: "/add/ut",
                icon: PlusCircle,
            },
            { name: "Add Exam Marks", path: "/add/exam", icon: PlusCircle },
        ],
        RESULTS: [
            { name: "Unit Test Results", path: "/marks/ut", icon: Trophy },
            { name: "Exam Results", path: "/marks/exam", icon: Trophy },
        ],
    },

    authority: {
        GENERAL: [
            { name: "Dashboard", path: "/", icon: LayoutDashboard },
            { name: "Students", path: "/view/students", icon: Users },
            { name: "Teachers", path: "/view/teachers", icon: Users },
            {
                name: "Mark Student Attendance",
                path: "/students/mark/attendance",
                icon: UserCheck,
            },
        ],
        "ADD MARKS": [
            {
                name: "Add Unit Test Marks",
                path: "/add/ut",
                icon: PlusCircle,
            },
            { name: "Add Exam Marks", path: "/add/exam", icon: PlusCircle },
        ],
        RESULTS: [
            { name: "Unit Test Results", path: "/marks/ut", icon: Trophy },
            { name: "Exam Results", path: "/marks/exam", icon: Trophy },
        ],
        MANAGE: [
            {
                name: "Add Announcement",
                path: "/add/announcement",
                icon: PlusCircle,
            },
            { name: "Announcements", path: "/announcements", icon: AnnouncementIcon },
            { name: "Syllabus", path: "/syllabus", icon: BookOpen },
            { name: "Timetable", path: "/timetable", icon: Calendar },
        ],
    },
};