import { useContext, useEffect, useState, useRef } from "react";
import tacticalMap from "../../assets/tactical-map.png";
import TacticalLogo from "../../components/TacticalLogo";
import { ChatContext } from "../../context/ChatContext";
import { useMeeting } from "@videosdk.live/react-sdk";
import { MdCall } from "react-icons/md";
import { handleSendMessage } from "../../utils/programs";
import { AuthContext } from "../../context/AuthContext";
import audioController from "../../utils/audioController";
// @ts-ignore
import callerTone from "../../assets/audio/caller.mp3";

const CallComponent = () => {
  const { callMessage, setCallMessage } = useContext<any>(ChatContext);
  const { authDetails } = useContext<any>(AuthContext);

  const [isCaller, setIsCaller] = useState(false);
  const [displayName, setDisplayName] = useState("Unknown");
  const [callDuration, setCallDuration] = useState(0);

  const durationInterval = useRef<any>(null);
  const callStartRef = useRef<number | null>(null);
  const autoDeclineTimeout = useRef<any>(null);

  const { localParticipant, participants, leave } = useMeeting({
    onParticipantJoined: (participant) => {
      if (participant.id !== localParticipant?.id) {
        audioController.stopRingtone();
        if (!callStartRef.current) {
          callStartRef.current = Date.now();
          durationInterval.current = setInterval(() => {
            setCallDuration(
              Math.floor((Date.now() - callStartRef.current!) / 1000),
            );
          }, 1000);
        }
      }
    },
    onParticipantLeft: () => {
      if (participants.size <= 1 && durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    },
  });

  useEffect(() => {
    if (!callMessage) return;

    setIsCaller(callMessage.isMyChat);
    setDisplayName(
      callMessage.isMyChat
        ? callMessage.receiver?.name
        : callMessage.sender?.name,
    );

    if (!callMessage.isMyChat && callMessage.status === "ringing") {
      // Stop any previous ringtone
      audioController.stopRingtone();
      // Play ringtone for incoming call
      audioController.playRingtone(callerTone, true);

      // Auto-decline after 30 seconds
      autoDeclineTimeout.current = setTimeout(() => {
        handleEndCall();
      }, 30_000);
    }

    return () => {
      // Cleanup timers and ringtone on unmount or callMessage change
      if (autoDeclineTimeout.current) clearTimeout(autoDeclineTimeout.current);
      audioController.stopRingtone();
      if (durationInterval.current) clearInterval(durationInterval.current);
    };
  }, [callMessage]);

  if (!callMessage) return null;

  const isIncoming = !isCaller && callMessage.status === "ringing";
  const isOutgoing = isCaller && callMessage.status === "ringing";
  const isActive = callMessage.status === "active" || isCaller;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleEndCall = () => {
    // Stop timers and ringtone
    if (autoDeclineTimeout.current) clearTimeout(autoDeclineTimeout.current);
    audioController.stopRingtone();
    if (durationInterval.current) clearInterval(durationInterval.current);
    setCallDuration(0);
    callStartRef.current = null;

    // Determine recipient
    const otherUserId = isCaller
      ? callMessage?.receiver?.id
      : callMessage?.sender?.id;

    // Send end call message
    handleSendMessage(
      {
        message: "__DEFCOMM_CALL_ENDED_tv1__",
        chat_user_type: "user",
        chat_user_id: otherUserId,
      } as any,
      authDetails,
    );

    // Leave meeting
    leave();

    // Clear UI
    setCallMessage(null);
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0e05] text-white font-sans flex flex-col items-center justify-between p-8 relative">
      {/* Tactical Map Background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none flex justify-center items-end"
        style={{
          backgroundImage: "radial-gradient(#1a2e0a 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <img src={tacticalMap} alt="" />
      </div>

      {/* Header */}
      <header className="z-10 flex items-center space-x-8">
        <TacticalLogo />
      </header>

      {/* Call Status */}
      <main className="z-20 flex flex-col items-center mb-24">
        {(isIncoming || isOutgoing) && (
          <div className="flex items-center space-x-2 mb-8 animate-pulse text-lime-400">
            <div className="flex items-end space-x-1 h-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-current"
                  style={{ height: `${i * 25}%` }}
                />
              ))}
            </div>
            <span className="uppercase tracking-widest text-sm font-bold">
              {isCaller ? "Outgoing Call..." : "Incoming Call..."}
            </span>
          </div>
        )}

        {/* Call Box */}
        <div className="flex flex-col items-center space-y-4 bg-black/60 border border-white/10 p-6 rounded-2xl backdrop-blur-md mb-4 min-w-[320px]">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-lime-500 bg-gray-900 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-lime-500">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>
              {isActive && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime-500 rounded-full border-2 border-[#0a0e05] animate-pulse"></div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight line-clamp-1">
                {displayName}
              </h2>
              <p className="text-xs text-lime-500 font-mono uppercase tracking-widest">
                {isIncoming
                  ? "Awaiting Connection"
                  : isOutgoing
                    ? "Ringing..."
                    : "Signal Secure"}
              </p>
              {isActive && (
                <p className="text-xs text-lime-300 font-mono uppercase tracking-widest mt-1">
                  Duration: {formatDuration(callDuration)}
                </p>
              )}
            </div>
          </div>

          {/* Incoming Call Buttons */}
          {isIncoming && (
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  audioController.stopRingtone();
                  setCallMessage({ ...callMessage, status: "active" });
                  callStartRef.current = Date.now();
                  durationInterval.current = setInterval(() => {
                    setCallDuration(
                      Math.floor((Date.now() - callStartRef.current!) / 1000),
                    );
                  }, 1000);
                }}
                className="px-12 py-4 bg-lime-600 hover:bg-lime-500 font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-lg shadow-lime-900/40"
              >
                Accept
              </button>
              <button
                onClick={handleEndCall}
                className="px-12 py-4 bg-red-700 hover:bg-red-600 font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-lg shadow-red-900/40"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Active Call Hang-Up Button */}
      {isActive && !isIncoming && (
        <button
          onClick={handleEndCall}
          className="fixed bottom-8 w-20 h-20 flex items-center justify-center bg-red-700 hover:bg-red-600 text-white text-2xl rounded-full shadow-lg shadow-red-900/40 transition-all active:scale-95 z-50"
        >
          <MdCall className="rotate-135" />
        </button>
      )}

      {/* Footer */}
      <footer className="z-10 w-full flex justify-between text-[10px] font-mono opacity-40 uppercase tracking-tighter">
        <span>Channel: Alpha-9-Echo</span>
        <span>09.0765° N / 07.3986° E</span>
      </footer>
    </div>
  );
};

export default CallComponent;
