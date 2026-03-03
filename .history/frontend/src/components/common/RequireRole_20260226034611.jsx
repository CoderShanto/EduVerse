import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const RequireRole = ({ roles = [], children }) => {
  const { user } = useContext(AuthContext);

  if (!user || !user.token) return <Navigate to="/account/login" replace />;

  const role = user?.user?.role;

  if (!roles.includes(role)) {
    return <Navigate to="/account/dashboard" replace />;
  }

  return children;
};

export default RequireRole;