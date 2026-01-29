import { useContext, useState } from "react";
import CallComponent from "../../components/call/CallComponent";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const TacticalCallInterface = () => {
  const { authDetails } = useContext<any>(AuthContext);
  const { callMessage } = useContext<any>(ChatContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleValue = 0.65; // Shrink to 65% of original size
  const originalWidth = 400; // The width the component expects to look "right"
  const originalHeight = 600; // The height the component expects
  console.log("call", callMessage);

  if (!callMessage?.meetingId && !authDetails?.user?.meeting_token) return null;

  return (
    <MeetingProvider
      config={
        {
          meetingId: callMessage?.meetingId,
          name: authDetails?.user?.name || "Guest User",
          participantId: authDetails?.user?.id || `guest-${Date.now()}`,
          micEnabled: false,
          webcamEnabled: false,
          mode: "SEND_AND_RECV",
          chatEnabled: true,
          raiseHandEnabled: true,
          debugMode: true,
        } as any
      }
      token={authDetails?.user?.meeting_token || "default"}
    >
      {/* Background Overlay (Only visible when expanded) */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`fixed transition-all duration-500 ease-in-out z-50 overflow-hidden shadow-2xl border border-white/10
          ${
            isExpanded
              ? "inset-0 m-auto rounded-none md:rounded-3xl w-full h-full"
              : "right-6 bottom-6 w-65 h-97.5 rounded-2xl cursor-pointer hover:border-lime-500/50"
          }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* The Scaling Wrapper */}
        <div
          className="origin-top-left transition-transform duration-500"
          style={{
            width: isExpanded ? "100%" : `${originalWidth}px`,
            height: isExpanded ? "100%" : `${originalHeight}px`,
            transform: isExpanded ? "scale(1)" : `scale(${scaleValue})`,
          }}
        >
          <CallComponent />
        </div>

        {/* WhatsApp-style Minimize Button (Only shows when full screen) */}
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="absolute top-6 left-6 z-60 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
    </MeetingProvider>
  );
};

export default TacticalCallInterface;
