import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useFetchMe } from "./hooks/useAuth";
import Spinner from "./components/Spinner";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/subPages/Dashboard"));
const My = lazy(() => import("./pages/subPages/ViewAttendance/My"));
const Students = lazy(() => import("./pages/subPages/ViewAttendance/Students"));
const Teachers = lazy(() => import("./pages/subPages/ViewAttendance/Teachers"));
const Student = lazy(() => import("./pages/subPages/MarkAttendance/Student"));
const Ut = lazy(() => import("./pages/subPages/ViewMark/Ut"));
const Exam = lazy(() => import("./pages/subPages/ViewMark/Exam"));
const AddUtMarks = lazy(() =>
  import("./pages/subPages/AddMarks/Ut").then((m) => ({ default: m.Ut })),
);
const AddExamMarks = lazy(() =>
  import("./pages/subPages/AddMarks/Exams").then((m) => ({ default: m.Exams })),
);
const ViewTeachers = lazy(() =>
  import("./pages/subPages/view/Teachers/Main").then((m) => ({
    default: m.Main,
  })),
);
const ViewStudents = lazy(() =>
  import("./pages/subPages/view/Students/Main").then((m) => ({
    default: m.Main,
  })),
);
const AddAnnouncement = lazy(() =>
  import("./pages/subPages/Announcement/Add").then((m) => ({ default: m.Add })),
);
const AnnouncementsDetails = lazy(() =>
  import("./pages/subPages/Announcement/Details").then((m) => ({
    default: m.AnnouncementsDetails,
  })),
);
const AnnouncementsPage = lazy(() =>
  import("./pages/subPages/Announcement/Page").then((m) => ({
    default: m.Page,
  })),
);
const TimeTable = lazy(() =>
  import("./pages/subPages/view/Timetable/Main").then((m) => ({
    default: m.Main,
  })),
);
const Syllabus = lazy(() =>
  import("./pages/subPages/Syllabus/Main").then((m) => ({ default: m.Main })),
);
const TeacherProfile = lazy(() =>
  import("./pages/subPages/Profile/TeacherProfile/Main").then((m) => ({
    default: m.Main,
  })),
);
const StudentProfile = lazy(() =>
  import("./pages/subPages/Profile/Student/Main").then((m) => ({
    default: m.Main,
  })),
);
const Profile = lazy(() =>
  import("./pages/subPages/Profile/My/Main").then((m) => ({ default: m.Main })),
);

const App = () => {
  const { isPending, data: userData } = useFetchMe();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route
            path="/login"
            element={userData ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
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
            <Route path="/add/announcement" element={<AddAnnouncement />} />
            <Route path="/timetable" element={<TimeTable />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route
              path="announcements/:id"
              element={<AnnouncementsDetails />}
            />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="student/profile/:id" element={<StudentProfile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="teacher/profile/:id" element={<TeacherProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
