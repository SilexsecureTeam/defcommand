import { AlertTriangle } from "lucide-react";

interface EmergencyOverlayProps {
  onAbort: () => void;
}

export default function EmergencyOverlay({ onAbort }: EmergencyOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm border-4 border-red-700 animate-pulse">
      {/* Alert Icon */}
      <AlertTriangle size={140} className="text-red-600 mb-6 animate-shake" />

      {/* Main Alert Heading */}
      <h1 className="text-7xl font-extrabold text-white mb-3 tracking-wider uppercase">
        CRITICAL ALERT
      </h1>

      {/* Instruction/Action Text */}
      <p className="text-xl text-red-400 font-mono mb-8 text-center max-w-lg">
        Immediate action required. Execute emergency protocols now. Failure to
        comply could result in system compromise.
      </p>

      {/* Abort Button */}
      <button
        onClick={onAbort}
        className="px-12 py-4 bg-red-600 text-white font-bold rounded-lg uppercase tracking-wider shadow-lg hover:bg-white hover:text-red-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500"
      >
        Abort Protocol
      </button>
    </div>
  );
}
