import { Radio, User, Clock, X } from "lucide-react";
import useChat from "../../hooks/useChat";
import { useEmergency } from "../../context/EmergencyContext";

export default function EmergencyOverlay() {
  const {
    emergencies,
    selectedEmergency,
    selectEmergency,
    acknowledge,
    isPanelOpen,
    closePanel, // import closePanel
  } = useEmergency();

  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();

  if (!isPanelOpen) return null;

  const sender = contacts?.find(
    (c: any) => c.contact_id_encrypt === selectedEmergency?.senderId,
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center font-mono">
      <div className="relative w-full max-w-5xl grid grid-cols-3 gap-4 p-4">
        {/* Left Panel — Emergency List */}
        <div className="col-span-1 border border-red-700/40 bg-black/40 p-4 overflow-y-auto max-h-[80vh]">
          <h2 className="text-red-500 uppercase text-sm mb-4 tracking-widest">
            Active Emergencies
          </h2>
          {emergencies.map((e: any) => (
            <div
              key={e.id}
              onClick={() => selectEmergency(e.id)}
              className={`cursor-pointer p-3 mb-2 rounded border ${
                selectedEmergency?.id === e.id
                  ? "border-red-500 bg-red-900/20"
                  : "border-red-700/20"
              }`}
            >
              <div className="text-white font-semibold">
                {sender?.contact_name || e.senderId}
              </div>
              <div className="text-red-400 text-xs">
                {new Date(e.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel — Selected Emergency Details */}
        <div className="col-span-2 border border-red-700/40 bg-black/40 p-6 flex flex-col justify-between relative">
          {/* Close button in top-right */}
          <button
            onClick={closePanel} // ✅ closes overlay without removing emergencies
            className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-400"
            title="Close"
          >
            <X size={20} />
          </button>

          {selectedEmergency ? (
            <>
              <div>
                <div className="text-4xl font-bold tracking-widest text-red-600 uppercase mb-4">
                  CRITICAL ALERT
                </div>

                <div className="space-y-3 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-red-500" />
                    <span className="text-red-400">Sender:</span>
                    <span className="text-white font-semibold">
                      {sender?.contact_name || selectedEmergency.senderId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4 text-red-500" />
                    <span className="text-red-400">Channel:</span>
                    <span className="text-white">
                      Field Emergency Broadcast
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-red-400">Timestamp:</span>
                    <span className="text-white">
                      {new Date(selectedEmergency.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border border-red-700/40 bg-black/40 p-4 text-red-300 text-sm leading-relaxed mb-4">
                  Immediate action required. Review the situation and issue
                  operational directives.
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => acknowledge(selectedEmergency.id)}
                  className="w-full py-3 border border-green-600/80 bg-green-900/20 text-green-400 uppercase tracking-widest text-sm hover:bg-green-600/20 hover:text-green-300 transition focus:outline-none"
                >
                  Acknowledge Signal
                </button>
                <button className="w-full py-3 border border-yellow-600/80 bg-yellow-900/20 text-yellow-400 uppercase tracking-widest text-sm hover:bg-yellow-600/20 hover:text-yellow-300 transition focus:outline-none">
                  Dispatch Support Unit
                </button>
                <button className="w-full py-3 border border-blue-600/80 bg-blue-900/20 text-blue-400 uppercase tracking-widest text-sm hover:bg-blue-600/20 hover:text-blue-300 transition focus:outline-none">
                  Issue Field Directive
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center mt-20">
              Select an emergency from the left panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
