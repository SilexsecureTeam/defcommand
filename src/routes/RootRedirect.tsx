import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RootRedirect = ({ children }: any) => {
  const { authDetails } = useContext<any>(AuthContext);
  console.log(authDetails);

  // Route user appropriately
  return authDetails ? <Navigate to="/dashboard/home" replace /> : children;
};

export default RootRedirect;
