// src/components/ProtectedRoute.tsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { email } = useContext(UserContext);

  if (!email) return <Navigate to="/signin" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
