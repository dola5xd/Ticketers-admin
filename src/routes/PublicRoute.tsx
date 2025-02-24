import { useAuth } from "@/context/AuthContext";
import { ReactElement } from "react";
import { Navigate } from "react-router";

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
