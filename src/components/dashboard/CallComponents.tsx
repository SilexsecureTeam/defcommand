import { Link } from "react-router-dom";

export const CommunicationTab = ({
  icon,
  active = false,
  direct = () => {},
}: any) => (
  <div
    onClick={direct}
    className={`flex items-center justify-center bg-oliveLight w-12 h-12 p-2 rounded-xl cursor-pointer transition-colors ${active ? "bg-white/10" : "hover:bg-white/5"}`}
  >
    <img src={icon} className="w-[80%]" />
  </div>
);

export const CallItem = ({ call, userId }: any) => {
  const isOutgoing = call.send_user_id === userId;
  const isMissed = call.call_state === "miss" && !isOutgoing;

  // Label for display
  const typeLabel = isMissed ? "Missed" : isOutgoing ? "Outgoing" : "Incoming";

  // Only mark missed calls from others in red, otherwise normal recent call styling
  const bgClass = isMissed ? "bg-red-600 text-white" : "bg-black/20 text-white"; // standard recent call style

  // Display the other person's info
  const contactName = isOutgoing ? call.recieve_user_name : call.send_user_name;
  const contactAvatar =
    call.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

  const callTime = new Date(call.created_at).toLocaleString();

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-sm border border-white/5 cursor-pointer ${bgClass}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
          <img src={contactAvatar} alt={contactName} />
        </div>
        <span className="text-[11px] font-bold">{contactName}</span>
      </div>
      <div className="flex flex-col items-end text-right">
        <span className="text-[10px] font-medium opacity-80">{typeLabel}</span>
        <span className="text-[9px] opacity-60">{callTime}</span>
      </div>
    </div>
  );
};

export const AppSquare = ({ icon, link }: any) => (
  <Link
    to={link}
    className="w-18 h-18 bg-white rounded-2xl flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform cursor-pointer"
  >
    <img src={icon} className="w-[50%]" />
  </Link>
);

export const ActionIcon = ({ Icon, label, active = false }: any) => (
  <div className="flex flex-col items-center gap-1 group cursor-pointer">
    <div
      className={`w-18 h-18 rounded-xl flex items-center justify-center transition-all shadow-md ${active ? "bg-oliveHover text-black" : "bg-white text-black group-hover:bg-[#dbeaca]"}`}
    >
      <Icon size={40} />
    </div>
    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100">
      {label}
    </span>
  </div>
);
