import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useFetchMe } from "../hooks/useAuth";

const ProtectedRoute = ({children}: {children:ReactNode}) => {
  const { data } = useFetchMe();
  return data ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
