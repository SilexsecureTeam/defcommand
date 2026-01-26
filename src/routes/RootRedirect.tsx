import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RootRedirect = () => {
  const { authDetails } = useContext(AuthContext);

  // After ready, route user appropriately
  return authDetails ? (
    <Navigate to="/dashboard/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RootRedirect;
