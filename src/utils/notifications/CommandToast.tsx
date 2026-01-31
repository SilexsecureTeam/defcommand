import { X } from "lucide-react";
import useChat from "../../hooks/useChat";
import { useCommand } from "../../context/CommandContext";
export function CommandToast() {
  const { activeNotification, setActiveNotification, openPanel } = useCommand();
  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();

  // 1. Helper to resolve ID to Name
  const getRespondentName = (id: string) => {
    const contact = contacts?.find((c: any) => c.contact_id_encrypt === id);
    return contact?.name || contact?.contact_name || `Unit ${id.slice(0, 4)}`;
  };

  if (!activeNotification) return null;

  return (
    /* Wrapper: Centered at top, allows clicking through to dashboard */
    <div className="bg-black/30 h-full fixed top-6 inset-x-0 flex justify-center z-100 pointer-events-none animate-in slide-in-from-top-full duration-500">
      {/* The Toast: Re-enables interaction for buttons */}
      <div className="bg-black text-white px-6 py-4 rounded-[28px] shadow-2xl flex items-center gap-10 w-full max-w-145 h-max border border-white/10 ring-1 ring-white/5 pointer-events-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-[#98C630] tracking-[0.2em]">
            Directive Acknowledged
          </span>
          <h3 className="text-[22px] font-black tracking-tight leading-none mt-1">
            {/* 2. Display the resolved name here */}
            {getRespondentName(activeNotification.recipientId)}
          </h3>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              setActiveNotification(null);
              openPanel();
            }}
            className="bg-white text-black px-6 py-2 rounded-full text-[11px] font-black uppercase hover:bg-gray-200 transition-all active:scale-95"
          >
            Reply
          </button>

          <button className="bg-white text-black px-6 py-2 rounded-full text-[11px] font-black uppercase hover:bg-gray-200 transition-all active:scale-95">
            Call
          </button>

          <button
            onClick={() => setActiveNotification(null)}
            className="ml-2 p-1 text-white/20 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
