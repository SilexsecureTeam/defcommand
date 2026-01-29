import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SecureRoute = () => {
  const { authDetails, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return null;

  if (!authDetails?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authDetails.user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  const status = authDetails.user.status;
  if (status !== "active" && status !== "pending") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default SecureRoute;
