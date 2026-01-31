import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, AlertTriangle, Clock } from "lucide-react";
import { useUpdaterContext } from "../../context/UpdaterContext";

type Props = {
  mandatory?: boolean;
};

export default function UpdateOverlay({ mandatory = false }: Props) {
  const { state, progress, update, error, downloadAndInstall } =
    useUpdaterContext();

  // Professional state management: Dismiss locally instead of reloading the app
  const [isDismissed, setIsDismissed] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  // Pull grace period from env (e.g., VITE_UPDATE_GRACE_DAYS=3)
  const GRACE_PERIOD_DAYS = Number(import.meta.env.VITE_UPDATE_GRACE_DAYS) || 3;

  useEffect(() => {
    if (state === "available" && update?.version) {
      // Reset dismissal if a new version is detected
      setIsDismissed(false);

      const storageKey = `update_seen_${update.version}`;
      const firstSeen = localStorage.getItem(storageKey);
      const now = Date.now();
      const gracePeriodMs = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

      if (!firstSeen) {
        localStorage.setItem(storageKey, now.toString());
        setDaysRemaining(GRACE_PERIOD_DAYS);
      } else {
        const elapsed = now - parseInt(firstSeen);
        const remaining = Math.ceil(
          (gracePeriodMs - elapsed) / (1000 * 60 * 60 * 24),
        );
        setDaysRemaining(remaining > 0 ? remaining : 0);
      }
    }
  }, [state, update?.version, GRACE_PERIOD_DAYS]);

  const canBypass = !mandatory && daysRemaining !== null && daysRemaining > 0;

  // Professional Visibility Logic: Don't show if dismissed unless it's mandatory
  const isVisible = useMemo(() => {
    const activeStates = ["available", "downloading", "installing", "error"];
    const isStateActive = activeStates.includes(state);

    if (!isStateActive) return false;
    if (mandatory) return true;
    return !isDismissed;
  }, [state, mandatory, isDismissed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-1000 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 font-mono"
        >
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-size-[100%_4px,3px_100%]" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] overflow-hidden relative"
          >
            {/* TOP HEADER */}
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                System_Update_Protocol
              </span>
              {canBypass && (
                <span className="flex items-center gap-1 text-amber-500/80">
                  <Clock size={10} /> {daysRemaining}D_UNTIL_ENFORCED
                </span>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <Cpu size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
                    Defcommand_{update?.version}
                  </h2>
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                    Security Patch Ready
                  </p>
                </div>
              </div>

              {state === "available" && (
                <div className="space-y-6">
                  <div className="text-[11px] leading-relaxed text-zinc-400 bg-zinc-900/30 p-4 border border-zinc-800/50 italic">
                    {update?.body || "Patch notes encrypted or unavailable."}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={downloadAndInstall}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-xs font-bold uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      Authorize Update
                    </button>

                    {canBypass && (
                      <button
                        onClick={() => setIsDismissed(true)}
                        className="w-full bg-transparent border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                      >
                        Snooze Protocol
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* PROGRESS VIEW */}
              {(state === "downloading" || state === "installing") && (
                <div className="py-4">
                  <div className="flex justify-between text-[10px] text-emerald-500 mb-2 font-bold tracking-widest">
                    <span>
                      {state === "downloading"
                        ? "DOWNLOADING_ASSETS"
                        : "RECONSTRUCTING_CORE"}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800 p-px">
                    <motion.div
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ERROR VIEW */}
              {state === "error" && (
                <div className="space-y-4">
                  <div className="bg-rose-500/10 border border-rose-500/30 p-4 flex items-center gap-3">
                    <AlertTriangle className="text-rose-500" size={20} />
                    <p className="text-[10px] text-rose-400 uppercase leading-tight font-bold">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={downloadAndInstall}
                    className="w-full bg-rose-600 text-white py-4 text-xs font-bold uppercase tracking-widest"
                  >
                    Retry Handshake
                  </button>
                </div>
              )}
            </div>

            {/* DECORATIVE SCAN LINE */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-px bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-0 pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
