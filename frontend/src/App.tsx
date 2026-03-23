import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useFetchMe } from "./hooks/useAuth";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";



const App = () => {
  const Login = lazy(() => import("./pages/Login"));
  
  
  
  const { isPending, data: userData } = useFetchMe();
  
  if(userData){
    console.log(userData);
  }
  
  if(isPending){
    return <Spinner/>
  }

  return (
    <>
      <Suspense>
        <Routes>
            <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
