import { useContext, useState } from "react";
import { Phone, Users } from "lucide-react";
import useChat from "../../hooks/useChat";
import { MdClose } from "react-icons/md";
import { handleSendMessage } from "../../utils/programs";
import { createMeeting } from "../../services/videosdk";
import { AuthContext } from "../../context/AuthContext";

interface Contact {
  id: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  contact_id_encrypt: string;
}

type CallMode = "direct" | "conference" | null;

const CallActions = () => {
  const { useFetchContacts } = useChat();
  const { authDetails } = useContext<any>(AuthContext);
  const { data: contacts = [] } = useFetchContacts();

  const [modalOpen, setModalOpen] = useState(false);
  const [callMode, setCallMode] = useState<CallMode>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isStartingCall, setIsStartingCall] = useState(false); // Loader state

  const openModal = (mode: CallMode) => {
    setCallMode(mode);
    setModalOpen(true);
    setSelectedContacts([]);
  };

  const toggleContact = (contact: Contact) => {
    setSelectedContacts((prev) =>
      prev.find((c) => c.id === contact.id)
        ? prev.filter((c) => c.id !== contact.id)
        : [...prev, contact],
    );
  };

  const handleStartCall = async () => {
    if (selectedContacts.length === 0) return;

    setIsStartingCall(true); // Start loader

    try {
      if (callMode === "direct" && selectedContacts[0]) {
        const token = await createMeeting(); // Async call
        console.log("Direct Call to", selectedContacts[0]);
        handleSendMessage(
          {
            message: `voice_call|${token}`,
            chat_user_type: "user",
            chat_user_id: selectedContacts[0]?.contact_id_encrypt,
          } as any,
          authDetails,
        );
      } else if (callMode === "conference" && selectedContacts.length > 0) {
        console.log("Conference with", selectedContacts);
        // TODO: implement conference call creation
      }
    } catch (err) {
      console.error("Failed to start call:", err);
    } finally {
      setIsStartingCall(false); // Stop loader
      setModalOpen(false);
      setSelectedContacts([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full">
      <button
        onClick={() => openModal("direct")}
        className="flex items-center justify-center w-full max-w-48 h-20 p-3 bg-oliveLight text-white rounded-2xl hover:bg-oliveGreen/80 transition-colors shadow-md hover:scale-105"
      >
        Direct Call
      </button>

      <button
        onClick={() => openModal("conference")}
        className="flex items-center justify-center w-full max-w-48 h-20 p-3 bg-oliveLight text-white rounded-2xl hover:bg-oliveGreen/80 transition-colors shadow-md hover:scale-105"
      >
        Conference Call
      </button>

      {/* Single Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1204] rounded-2xl w-full max-w-md max-h-[80vh] shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center bg-[#1A2208] px-6 py-4 border-b border-[#4A5A2A] sticky top-0 z-10">
              <h2 className="text-white font-bold text-lg">
                {callMode === "direct" ? "Select Contact" : "Select Contacts"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition"
              >
                <MdClose />
              </button>
            </div>

            {/* Contact List */}
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {contacts.map((contact: Contact) => {
                const selected = selectedContacts.some(
                  (c) => c.id === contact.id,
                );
                return (
                  <div
                    key={contact.id}
                    onClick={() =>
                      callMode === "direct"
                        ? setSelectedContacts([contact])
                        : toggleContact(contact)
                    }
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                      selected
                        ? "bg-green-600/30 border border-green-600"
                        : "bg-[#2B3A1A]/50 hover:bg-[#39490D]"
                    }`}
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {contact.contact_name}
                      </p>
                      <p className="text-[#98C630] text-xs">
                        {contact.contact_phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-oliveHover">
                      {callMode === "direct" ? (
                        <Phone size={16} />
                      ) : (
                        <Users size={16} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-[#4A5A2A] bg-[#1A2208]">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleStartCall}
                disabled={selectedContacts.length === 0 || isStartingCall}
                className={`px-4 py-2 rounded-xl text-white transition flex items-center gap-2 ${
                  selectedContacts.length
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-green-600/40 cursor-not-allowed"
                }`}
              >
                {isStartingCall && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {callMode === "direct" ? "Call" : "Start Conference"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallActions;
