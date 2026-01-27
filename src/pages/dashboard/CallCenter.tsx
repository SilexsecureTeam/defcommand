import CommunicationTabs from "../../components/CommunicationTabs";
import RecentCalls from "../../components/call/RecentCalls";
import QuickActions from "../../components/QuickActions";
import CallActions from "../../components/call/CallActions";

const CallCenter = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2 flex flex-col lg:flex-row gap-3 lg:gap-6 items-start">
        <div className="w-full flex flex-col space-y-10">
          <CommunicationTabs />
          <CallActions />
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="w-full px-2 lg:px-4 text-white">
          {/* Left Section: Recent Calls */}
          <RecentCalls />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default CallCenter;
