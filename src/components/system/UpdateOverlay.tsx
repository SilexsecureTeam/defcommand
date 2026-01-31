import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Download, AlertTriangle } from "lucide-react";
import { useUpdaterContext } from "../../context/UpdaterContext";

type Props = {
  mandatory?: boolean;
};

export default function UpdateOverlay({ mandatory = false }: Props) {
  const { state, progress, update, error, downloadAndInstall } =
    useUpdaterContext();

  const isVisible = [
    "available",
    "downloading",
    "installing",
    "error",
  ].includes(state);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-1000 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono"
        >
          {/* Tactical Pulse Background Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-size-[20px_20px]" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            {/* Top Status Bar */}
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System_Update_Protocol
              </div>
              {!mandatory && state === "available" && (
                <button
                  onClick={() => location.reload()}
                  className="hover:text-emerald-400 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Header Icon & Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-zinc-900 border border-zinc-800 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  {state === "error" ? (
                    <AlertTriangle size={24} className="text-rose-500" />
                  ) : (
                    <Cpu size={24} />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">
                    {state === "error" ? "Protocol Failure" : "Update Detected"}
                  </h2>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-tighter">
                    {state === "available"
                      ? "Awaiting manual override"
                      : "Executing sequence..."}
                  </p>
                </div>
              </div>

              {/* State: Available */}
              {state === "available" && (
                <div className="space-y-4">
                  <div className="bg-zinc-900/50 p-3 border-l-2 border-emerald-500">
                    <p className="text-xs text-zinc-300">
                      NEW_VERSION:{" "}
                      <span className="text-emerald-400">
                        {update?.version}
                      </span>
                    </p>
                    {update?.body && (
                      <div className="mt-2 text-[10px] leading-relaxed text-zinc-500 max-h-24 overflow-y-auto scrollbar-hide italic">
                        {update.body}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={downloadAndInstall}
                    className="group relative w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-xs font-bold uppercase tracking-widest transition-all overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Download size={14} /> Initiate Deployment
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              )}

              {/* State: Downloading/Installing */}
              {(state === "downloading" || state === "installing") && (
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1 uppercase tracking-widest">
                    <span>
                      {state === "downloading"
                        ? "Retrieving Packets"
                        : "Patching Core"}
                    </span>
                    <span className="text-emerald-400">{progress}%</span>
                  </div>

                  <div className="relative h-1 bg-zinc-900 overflow-hidden border border-zinc-800">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                    {/* Laser Scan Effect */}
                    <motion.div
                      animate={{ left: ["-10%", "110%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute top-0 w-8 h-full bg-white/20 skew-x-12"
                    />
                  </div>
                  <p className="text-[9px] text-zinc-600 animate-pulse uppercase">
                    Do not terminate application process...
                  </p>
                </div>
              )}

              {/* State: Error */}
              {state === "error" && (
                <div className="space-y-4">
                  <div className="bg-rose-500/10 border border-rose-900/50 p-3">
                    <p className="text-[11px] text-rose-400 leading-tight">
                      <span className="font-bold uppercase underline">
                        Error Code:
                      </span>{" "}
                      {error || "Unknown system interruption"}
                    </p>
                  </div>
                  <button
                    onClick={downloadAndInstall}
                    className="w-full border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white py-3 text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Relaunch Protocol
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Trim */}
            <div className="h-1 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
