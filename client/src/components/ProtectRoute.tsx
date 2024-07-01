import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

type ProtectRouteProps = {
  children: React.ReactNode;
};
const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
};

export default ProtectRoute;
