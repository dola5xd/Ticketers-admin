import { useAuth } from "@/context/AuthContext";
import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router";

export const RequireAuth = ({ children }: { children: ReactElement }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
