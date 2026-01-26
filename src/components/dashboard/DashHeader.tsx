import { ShieldCheck, LayoutGrid, Radio } from "lucide-react";
import { useTime } from "../../utils/useTime";
import comm from "../../assets/comm.png";
import { MdFingerprint } from "react-icons/md";
const DashHeader = () => {
  const { formattedTime, formattedDate } = useTime();
  return (
    <div>
      <header className="flex justify-center items-center gap-8 mb-10">
        {/* Branding */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Defcomm" className="h-20" />
          <img src="/xshield.png" alt="xshield" className="h-15" />
        </div>
      </header>

      {/* --- CLOCK & STATUS PANEL --- */}
      <section className="bg-oliveLight rounded-[2.5rem] p-12 mb-8 relative flex flex-col items-center border border-white/5 shadow-[0px_4px_4px_0px_#00000040]">
        {" "}
        {/* Active Status Indicator */}
        <div className="absolute left-10 top-8 flex items-center gap-2">
          <MdFingerprint size={14} className="text-white" />
          <span className="text-[11px] font-bold text-oliveGreen tracking-[0.15em]">
            SECURE MODE ACTIVE
          </span>
        </div>
        {/* Main Time Display */}
        <div className="text-center">
          <h1 className="text-[55px] leading-none font-semibold text-white">
            {formattedTime}
          </h1>
          <p className="text-sm text-white font-medium">{formattedDate}</p>
        </div>
        {/* Right Side Controls */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col lg:flex-row gap-4">
          <button className="bg-[#1a240f] hover:bg-black px-6 py-3 rounded-xl text-[10px] text-white border border-white/10 flex items-center gap-4 uppercase tracking-widest transition-all group">
            Secure Mode
            <div className="w-7 h-4 rounded-full relative p-1 border-2 border-oliveGreen">
              <div className="absolute top-0 bottom-0 right-1 w-2 h-2 my-auto border-2 border-oliveGreen rounded-full"></div>
            </div>
          </button>
          <button className="bg-[#1a240f] hover:bg-black px-6 py-3 rounded-xl text-[10px] font-bold text-white border border-white/10 flex items-center gap-2 uppercase tracking-widest transition-all">
            <LayoutGrid size={16} /> All Units
          </button>
        </div>
        {/* The Red Handheld Radio Icon */}
        <div className="absolute left-10 bottom-8 w-14 h-20 bg-[#d12229] rounded-2xl flex flex-col items-center justify-center shadow-[0px_3.47px_3.47px_0px_#00000040] border-t border-white/20">
          <img src={comm} alt="comm" className="h-16" />
        </div>
      </section>
    </div>
  );
};

export default DashHeader;
