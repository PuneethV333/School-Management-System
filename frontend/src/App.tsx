import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useFetchMe } from "./hooks/useAuth";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/subPages/Dashboard";
import My from "./pages/subPages/ViewAttendance/My";
import Students from "./pages/subPages/ViewAttendance/Students";
import Teachers from "./pages/subPages/ViewAttendance/Teachers";
import Student from "./pages/subPages/MarkAttendance/Student";
import Ut from "./pages/subPages/ViewMark/Ut";
import Exam from "./pages/subPages/ViewMark/Exam";
import { AnnouncementsDetails } from "./pages/subPages/Announcement/Details";
import { Ut as AddUtMarks } from "./pages/subPages/AddMarks/Ut";
import { Exams as AddExamMarks } from "./pages/subPages/AddMarks/Exams";
import { Main as ViewTeachers } from "./pages/subPages/view/Teachers/Main";
import { Main as ViewStudents } from "./pages/subPages/view/Students/Main";
import {Add as AddAnnouncement} from './pages/subPages/Announcement/Add'
import {Main as TimeTable} from './pages/subPages/view/Timetable/Main'
import {Main as Syllabus} from './pages/subPages/Syllabus/Main'

const App = () => {
  const Login = lazy(() => import("./pages/Login"));

  const { isPending, data: userData } = useFetchMe();

  if (userData) {
    console.log(userData);
  }

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Suspense>
        <Routes>
          <Route
            path="/login"
            element={userData ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="my/attendance" element={<My />} />
            <Route path="students/attendance" element={<Students />} />
            <Route path="teachers/attendance" element={<Teachers />} />
            <Route path="students/mark/attendance" element={<Student />} />
            <Route path="marks/ut" element={<Ut />} />
            <Route path="marks/exam" element={<Exam />} />
            <Route path="add/ut" element={<AddUtMarks />} />
            <Route path="add/exam" element={<AddExamMarks />} />
            <Route path="view/students" element={<ViewStudents />} />
            <Route path="view/teachers" element={<ViewTeachers />} />
            <Route path="/add/announcement" element={<AddAnnouncement/>}/>
            <Route path="/timetable" element={<TimeTable/>}/>
            <Route path="/syllabus" element={<Syllabus/>}/>
            <Route
              path="announcements/:id"
              element={<AnnouncementsDetails />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
