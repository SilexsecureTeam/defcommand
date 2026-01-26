import RecentCalls from "../../components/call/RecentCalls";
import RecentApps from "../../components/RecentApps";
import QuickActions from "../../components/QuickActions";
import CommunicationTabs from "../../components/CommunicationTabs";

const SecureCall: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2 flex flex-col gap-6 w-full max-w-5xl mx-auto text-white">
        {/* --- TOP ROW: COMMUNICATION TABS --- */}
        <CommunicationTabs />

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 items-start">
          {/* Left Section: Recent Calls */}
          <RecentCalls />

          {/* Middle Section: Recent Apps */}
          <RecentApps />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default SecureCall;
