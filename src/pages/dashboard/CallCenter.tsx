import React from "react";
import CommunicationTabs from "../../components/CommunicationTabs";
import RecentCalls from "../../components/call/RecentCalls";
import RecentApps from "../../components/RecentApps";
import QuickActions from "../../components/QuickActions";
import CallActions from "../../components/call/CallActions";

const CallCenter = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="flex flex-col space-y-10">
        <CommunicationTabs />
        <CallActions />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="p-4 text-white">
        {/* Left Section: Recent Calls */}
        <RecentCalls />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default CallCenter;
