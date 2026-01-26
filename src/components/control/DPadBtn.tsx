const positionStyles: Record<string, string> = {
  top: "rounded-[40px_40px_12px_12px] w-14 h-10 lg:w-20 lg:h-10",
  bottom: "rounded-[12px_12px_40px_40px] w-14 h-10 lg:w-20 lg:h-10",
  left: "rounded-[40px_12px_12px_40px] w-10 h-14 lg:w-10 lg:h-20",
  right: "rounded-[12px_40px_40px_12px] w-10 h-14 lg:w-10 lg:h-20",
};

export default function DPadBtn({ icon, onClick, position, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        bg-[#333] border-2 border-[#999]
        text-white hover:border-[#98C630] hover:text-[#98C630]
        transition-all active:scale-95
        
        ${positionStyles[position]}
      `}
    >
      {icon}
    </button>
  );
}
