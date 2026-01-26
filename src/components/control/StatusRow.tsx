import React from "react";

export default function StatusRow({ label, value, color = "text-[#98C630]" }) {
  return (
    <div className="flex justify-between items-center border-b border-[#2B3A1A] pb-1">
      <span className="text-xs font-bold uppercase tracking-widest text-[#6B7A41]">
        {label}
      </span>
      <span className={`text-sm font-black uppercase ${color}`}>{value}</span>
    </div>
  );
}
