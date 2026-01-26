import { FaUserGroup } from "react-icons/fa6";
import { CommunicationTab } from "../components/dashboard/CallComponents";
import message from "../assets/message.png";
import calls from "../assets/calls.png";
import upload from "../assets/upload.png";
import { useNavigate } from "react-router-dom";

const CommunicationTabs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-medium uppercase tracking-widest text-white ml-1">
        Secure Communications
      </span>
      <div className="flex items-center gap-3 bg-black/48 p-2 pl-4 w-fit border-l-[5px] border-l-olive">
        <CommunicationTab
          icon={message}
          direct={() => navigate("/dashboard/home")}
          active
        />
        <CommunicationTab
          icon={calls}
          direct={() => navigate("/dashboard/call-center")}
        />
        <CommunicationTab
          icon={upload}
          direct={() => navigate("/dashboard/home")}
        />
        <div className="h-8 w-px bg-white/10 mx-1" />
        <button className="flex items-center gap-1 bg-white text-black px-3 py-2 h-10 rounded-xl text-[10px] font-bold uppercase tracking-tighter">
          <FaUserGroup size={30} className="text-oliveLight" /> SecureGroup
        </button>
      </div>
    </div>
  );
};

export default CommunicationTabs;
