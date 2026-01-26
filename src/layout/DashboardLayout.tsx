import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import DashHeader from "../components/dashboard/DashHeader";
import usePusherChannel from "../hooks/usePusherChannel";
import { AuthContext } from "../context/AuthContext";
import useGroupChannels from "../hooks/useGroupChannel";
import useGroups from "../hooks/useGroup";
const DashboardLayout = () => {
  const { authDetails } = useContext<any>(AuthContext);
  const { useFetchGroups } = useGroups();
  const { data: groups } = useFetchGroups();

  useGroupChannels({
    groups,
    token: authDetails?.access_token,
  });

  usePusherChannel({
    userId: authDetails?.user_enid,
    token: authDetails?.access_token,
  });
  return (
    <div
      className="h-full flex flex-col p-8 select-none overflow-y-auto"
      style={{
        backgroundColor: "#000000",
        backgroundImage: `
      /* Layer 1: Very thin, dark grid lines */
      linear-gradient(rgba(20, 26, 5, 0.8) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(20, 26, 5, 0.8) 1px, transparent 1px),
      /* Layer 2: Large elliptical radial gradient centered at the top */
      radial-gradient(ellipse at 50% 40%, #36450D 0%, #000000 75%)
    `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        backgroundAttachment: "fixed",
      }}
    >
      <DashHeader />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
