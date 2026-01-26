export default function TelemetryBox({
  label,
  value,
  color = "text-white",
}: any) {
  return (
    <div className="bg-[#0D1204] border border-oliveGreen p-3 flex flex-col justify-between shadow-inner">
      <span className="text-sm uppercase tracking-widest font-bold text-[#D5D0D0]">
        {label}
      </span>
      <span className={`text-lg font-black  overflow-x-auto ${color}`}>
        {value}
      </span>
    </div>
  );
}
