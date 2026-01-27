import { Eye, ArrowLeft } from "lucide-react";

export default function HeaderBar({
  onBack,
}: {
  isConnected: boolean;
  onBack?: () => void;
}) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className="flex justify-between items-center mb-6 border-b border-[#4A5A2A] pb-4">
      <div className="flex items-center gap-4">
        {/* ⬅ Back Button */}
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-[#4A5A2A] rounded-lg flex items-center justify-center border border-[#98C630] hover:bg-[#98C630] hover:text-black transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center justify-center">
          <img src="/logo.png" alt="Defcomm" className="w-40" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="text-right hidden md:block">
          <p className="text-[10px] text-[#6B7A41]">SYSTEM TIME</p>
          <p className="text-sm font-bold text-white uppercase">
            {new Date().toLocaleTimeString([], { hour12: false })} UTC
          </p>
        </div>

        <div className="w-10 h-10 bg-[#4A5A2A] rounded-lg flex items-center justify-center border border-[#98C630] hover:bg-[#98C630] hover:text-black transition-all">
          <Eye size={20} />
        </div>
      </div>
    </header>
  );
}
