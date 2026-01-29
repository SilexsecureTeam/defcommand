import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RootRedirect = ({ children }: any) => {
  const { authDetails, isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  if (authDetails?.meeting_token) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children;
};

export default RootRedirect;
