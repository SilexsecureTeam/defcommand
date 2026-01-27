import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SecureRoute = () => {
  const { authDetails } = useContext<any>(AuthContext);

  const location = useLocation();

  // 🧍 Not logged in
  if (!authDetails) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Unauthorized role
  if (authDetails.user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  // 🚦 Optional: check account status
  const status = authDetails.user?.status;
  if (status !== "active" && status !== "pending") {
    return <Navigate to="/login" replace />;
  }

  // Authenticated and allowed
  return <Outlet />;
};

export default SecureRoute;
