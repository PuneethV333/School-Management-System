import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useFetchMe } from "./hooks/useAuth";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/subPages/Dashboard";
import My from "./pages/subPages/ViewAttendance/My";

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
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
