import { useState, useMemo } from "react";
import { useCommand } from "../context/CommandContext";
import useChat from "../hooks/useChat";
import {
  Search,
  Send,
  X,
  Terminal,
  User,
  Activity,
  History,
} from "lucide-react";

export default function CommandOverlay() {
  const { isPanelOpen, closePanel, sendCommand, sentCommands } = useCommand();
  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Helper for contact lookup
  const getContactName = (id: string) => {
    const contact = contacts?.find((c: any) => c.contact_id_encrypt === id);
    return contact?.name || contact?.contact_name || id;
  };

  // 1. Filtered Contacts List
  const filteredContacts = useMemo(() => {
    return contacts?.filter((c: any) =>
      (c.name || c.contact_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [contacts, search]);

  // 2. Filtered & Grouped History
  const filteredGroupedCommands = useMemo(() => {
    const map: Record<string, any[]> = {};
    sentCommands.forEach((cmd) => {
      const name = getContactName(cmd.recipientId).toLowerCase();
      if (name.includes(search.toLowerCase())) {
        if (!map[cmd.recipientId]) map[cmd.recipientId] = [];
        map[cmd.recipientId].push(cmd);
      }
    });
    return map;
  }, [sentCommands, search, contacts]);

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;
    sendCommand(input.trim(), selectedUser);
    setInput("");
  };

  // CRITICAL: Hooks called above, early return here
  if (!isPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0D1204] border border-[#4A5A2A] shadow-[0_0_60px_rgba(152,198,48,0.1)] rounded-2xl w-full max-w-135 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1A230A] border-b border-[#4A5A2A] p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#98C630]/10 rounded-md border border-[#98C630]/30">
              <Terminal size={16} className="text-[#98C630]" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#98C630]">
              Tactical Command Unit
            </h2>
          </div>
          <button
            onClick={closePanel}
            className="text-white/20 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 pt-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          {/* Target Section */}
          <div className="space-y-3">
            <div className="sticky top-0 pt-6 flex justify-between items-center bg-[#0D1204]">
              <label className="text-[10px] uppercase font-bold text-[#4A5A2A] tracking-widest">
                Target Intel
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4A5A2A]"
                />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#050802] border border-[#4A5A2A] rounded-md pl-8 pr-3 py-1.5 text-[10px] font-mono text-white focus:border-[#98C630] outline-none w-44"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredContacts?.slice(0, 6).map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedUser(c.contact_id_encrypt)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                    selectedUser === c.contact_id_encrypt
                      ? "bg-[#98C630] border-[#98C630] text-black shadow-[0_0_15px_rgba(152,198,48,0.3)]"
                      : "bg-[#111A05]/50 border-[#4A5A2A]/50 text-white/60 hover:border-[#98C630]/40"
                  }`}
                >
                  <User size={14} />
                  <span className="text-[11px] font-bold truncate">
                    {c.name || c.contact_name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#4A5A2A] tracking-widest">
              Directive
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INITIATE COMMAND SEQUENCE..."
                className="w-full bg-[#050802] border border-[#4A5A2A] p-4 rounded-xl text-[#98C630] font-mono text-sm h-28 focus:ring-1 focus:ring-[#98C630] outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!selectedUser || !input.trim()}
                className="absolute bottom-4 right-4 bg-[#98C630] text-black p-2.5 rounded-lg hover:brightness-110 active:scale-95 disabled:opacity-20 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* History */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#4A5A2A] tracking-widest">
              <History size={12} />
              <span>Log Feed</span>
            </div>
            <div className="space-y-4">
              {Object.keys(filteredGroupedCommands).length > 0 ? (
                Object.entries(filteredGroupedCommands).map(
                  ([recipientId, cmds]) => (
                    <div key={recipientId} className="space-y-2">
                      <p
                        className={`text-[10px] font-black uppercase tracking-tighter ${selectedUser === recipientId ? "text-[#98C630]" : "text-white/40"}`}
                      >
                        {getContactName(recipientId)}
                      </p>
                      {cmds.map((cmd) => (
                        <div
                          key={cmd.id}
                          className="flex justify-between items-center bg-[#111A05] border border-[#4A5A2A]/20 p-2.5 rounded-md"
                        >
                          <span className="text-[11px] font-mono text-white/80">
                            {cmd.command}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] font-bold text-[#98C630] uppercase">
                              {cmd.status}
                            </span>
                            <Activity size={10} className="text-[#98C630]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                )
              ) : (
                <div className="py-10 border border-dashed border-[#4A5A2A]/30 rounded-xl text-center">
                  <p className="text-[10px] text-[#4A5A2A] font-mono uppercase italic tracking-widest">
                    No matching logs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
