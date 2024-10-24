import { Navigate, Outlet } from "react-router-dom";

import path from "@/configs/path.config";
import { useAuth } from "@/contexts/auth.context";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
};

export const RejectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
};
