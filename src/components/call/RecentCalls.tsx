import { useContext, useState } from "react";
import { CallItem } from "../dashboard/CallComponents";
import useChat from "../../hooks/useChat";
import { AuthContext } from "../../context/AuthContext";

const RecentCalls = () => {
  const { authDetails } = useContext<any>(AuthContext);
  const { getCallLogs } = useChat();
  const { data: callLogs, isLoading, isError } = getCallLogs();

  const [showAll, setShowAll] = useState(false);

  const recentCalls = showAll ? callLogs : callLogs?.slice(0, 5);
  return (
    <div className="lg:col-span-4 bg-oliveLight/40 rounded-xl p-6 border border-white/5 shadow-tactical">
      <div className="flex justify-between  gap-2 mb-6">
        <h3 className="text-xl font-bold">Recent Calls</h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm underline opacity-60 hover:opacity-100"
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </div>

      <div
        className={`flex flex-col gap-2 ${
          showAll ? "max-h-70 overflow-y-auto" : ""
        }`}
      >
        {isLoading && (
          <p className="text-sm opacity-50 text-center">Loading calls...</p>
        )}
        {isError && (
          <p className="text-sm opacity-50 text-center text-red-400">
            Failed to load calls. Please try again.
          </p>
        )}
        {!isLoading && !isError && recentCalls?.length === 0 && (
          <p className="text-sm opacity-50 text-center">No recent calls</p>
        )}
        {!isLoading &&
          !isError &&
          recentCalls?.map((call: any, idx: any) => (
            <CallItem
              key={`${call.id}-${idx}`}
              call={call}
              userId={authDetails?.user_enid}
            />
          ))}
      </div>
    </div>
  );
};

export default RecentCalls;
