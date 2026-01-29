import { Radio, User, Clock, X, Send } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import useChat from "../../hooks/useChat";
import { useEmergency } from "../../context/EmergencyContext";

export default function EmergencyOverlay() {
  const {
    emergencies,
    selectedEmergency,
    selectEmergency,
    acknowledge,
    respond,
    isPanelOpen,
    closePanel,
  } = useEmergency();

  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();

  const [responseMessage, setResponseMessage] = useState("");
  useEffect(() => {
    setResponseMessage("");
  }, [selectedEmergency?.id]);

  const contactsById = useMemo(() => {
    if (!contacts) return {};
    return contacts?.reduce((acc: any, contact: any) => {
      acc[contact?.contact_id_encrypt] = contact;
      return acc;
    }, {});
  }, [contacts]);

  const enrichedEmergencies = useMemo(() => {
    return emergencies.map((e) => ({
      ...e,
      sender: contactsById[e.senderId] ?? null,
    }));
  }, [emergencies, contactsById]);

  const selectedEmergencyWithSender = useMemo(() => {
    if (!selectedEmergency) return null;
    return {
      ...selectedEmergency,
      sender: contactsById[selectedEmergency.senderId] ?? null,
    };
  }, [selectedEmergency, contactsById]);

  if (!isPanelOpen) return null;

  /**
   * Dispatch response
   */
  const handleRespond = () => {
    if (!responseMessage.trim() || !selectedEmergencyWithSender) return;

    respond(selectedEmergencyWithSender.id, responseMessage.trim());
    setResponseMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center font-mono">
      <div className="relative w-full max-w-5xl grid grid-cols-3 gap-4 p-4">
        {/* LEFT PANEL */}
        <div className="col-span-1 border border-red-700/40 bg-black/40 p-4 overflow-y-auto max-h-[80vh]">
          <h2 className="text-red-500 uppercase text-sm mb-4 tracking-widest">
            Active Emergencies
          </h2>

          {enrichedEmergencies.map((e) => (
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
                {e.sender?.contact_name || e.senderId}
              </div>
              <div className="text-xs text-red-400">
                {new Date(e.timestamp).toLocaleString()}
              </div>
              <div className="text-xs uppercase text-gray-400">{e.status}</div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-2 border border-red-700/40 bg-black/40 p-6 relative flex flex-col justify-between">
          <button
            onClick={closePanel}
            className="absolute top-2 right-2 text-red-500"
          >
            <X size={20} />
          </button>

          {selectedEmergencyWithSender && (
            <>
              {/* HEADER */}
              <div>
                <div className="text-4xl font-bold text-red-600 mb-4">
                  CRITICAL ALERT
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-red-500" />
                    {selectedEmergencyWithSender.sender?.contact_name ||
                      selectedEmergencyWithSender.senderId}
                  </div>

                  <div className="flex items-center gap-3">
                    <Radio className="w-4 h-4 text-red-500" />
                    Field Emergency Broadcast
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-red-500" />
                    {new Date(
                      selectedEmergencyWithSender.timestamp,
                    ).toLocaleString()}
                  </div>
                </div>

                {selectedEmergencyWithSender.datacenterMessage && (
                  <div className="mt-4 border border-blue-600/40 bg-blue-900/20 p-3 text-blue-300">
                    {selectedEmergencyWithSender.datacenterMessage}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3">
                {selectedEmergencyWithSender?.status !== "seen" &&
                  selectedEmergencyWithSender?.datacenterMessage !== "" && (
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Type command center response..."
                      rows={3}
                      className="w-full bg-black/60 border border-blue-700/40 text-blue-300 p-3 resize-none focus:outline-none focus:border-blue-500 placeholder:text-blue-600"
                    />
                  )}

                <button
                  onClick={() => acknowledge(selectedEmergencyWithSender.id)}
                  disabled={selectedEmergencyWithSender.status !== "pending"}
                  className="border border-green-600/80 py-3 text-green-400 uppercase disabled:opacity-40"
                >
                  Acknowledge
                </button>

                <button
                  onClick={handleRespond}
                  disabled={
                    selectedEmergencyWithSender.status === "seen" ||
                    !responseMessage.trim()
                  }
                  className="border border-blue-600/80 py-3 text-blue-400 uppercase disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Dispatch Response
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
