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
            <Route index element={<Dashboard/>}/>
            <Route path="my/attendance" element={<My/>}/>
            <Route path="students/attendance" element={<Students/>}/>
            <Route path="teachers/attendance" element={<Teachers/>}/>
            <Route path="students/mark/attendance" element={<Student/>}/>
            <Route path="marks/ut" element={<Ut/>}/>
            <Route path="marks/exam" element={<Exam/>}/>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
