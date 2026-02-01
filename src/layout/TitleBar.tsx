import { useEffect, useState } from "react";
import {
  FiX,
  FiMinus,
  FiSquare,
  FiCopy,
  FiWifi,
  FiBattery,
  FiBatteryCharging,
  FiLoader,
} from "react-icons/fi";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTime } from "../utils/useTime";
import { useUpdaterContext } from "../context/UpdaterContext";
import { isTauri } from "@tauri-apps/api/core";

export default function TitleBar() {
  const appWindow = getCurrentWindow();
  const { formattedTime } = useTime();
  const { state } = useUpdaterContext();

  const [isMaximized, setIsMaximized] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  // Window maximize tracking
  useEffect(() => {
    if (!isTauri) return;
    async function init() {
      try {
        setIsMaximized(await appWindow.isMaximized());
      } catch {}
    }
    init();

    const unlisten = appWindow.onResized(async () => {
      try {
        setIsMaximized(await appWindow.isMaximized());
      } catch (err) {
        console.log("onResize Error", err);
      }
    });

    return () => {
      unlisten.then((f) => f()).catch(() => {});
    };
  }, [appWindow]);

  // Battery + Network Status logic
  useEffect(() => {
    let battery: any = null;

    // Define update function so it can be referenced for removal
    const updateBatteryStatus = () => {
      if (battery) {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
      }
    };

    async function initBattery() {
      if ("getBattery" in navigator) {
        battery = await (navigator.getBattery as any)();
        updateBatteryStatus();
        battery.addEventListener("levelchange", updateBatteryStatus);
        battery.addEventListener("chargingchange", updateBatteryStatus);
      }
    }

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    initBattery();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", updateBatteryStatus);
        battery.removeEventListener("chargingchange", updateBatteryStatus);
      }
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const minimize = async () => {
    try {
      await appWindow.minimize();
    } catch (err) {
      console.error("Minimize failed:", err);
    }
  };

  const toggleMaximize = async () => {
    try {
      const max = await appWindow.isMaximized();
      max ? await appWindow.unmaximize() : await appWindow.maximize();
      setIsMaximized(!max);
    } catch (err) {
      console.error("Toggle maximize failed:", err);
    }
  };

  const close = async () => {
    try {
      await appWindow.close();
    } catch (err) {
      console.error("Close failed:", err);
    }
  };

  if (!isTauri) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-9999 flex items-center justify-between h-10 bg-zinc-950/50 backdrop-blur-md text-white px-4 select-none group border-b border-white/5"
      data-tauri-drag-region
    >
      {/* Idle View — Left (Time) */}
      <div
        className="flex items-center px-2 gap-2 opacity-100 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <span className="text-xs font-bold tracking-widest font-mono opacity-80">
          {formattedTime}
        </span>
      </div>

      {/* Idle View — Right (System Status) */}
      <div className="flex items-center gap-4 opacity-100 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2">
        {/* TACTICAL SCANNER HUD */}
        {state === "checking" && (
          <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 animate-pulse">
            <FiLoader size={10} className="text-emerald-400 animate-spin" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">
              Scanning_System
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <FiWifi
            size={14}
            className={
              online
                ? "text-emerald-500 opacity-80"
                : "text-rose-500 opacity-50"
            }
          />

          <div className="flex items-center gap-1.5">
            {isCharging ? (
              <FiBatteryCharging
                size={14}
                className="text-amber-400 opacity-90"
              />
            ) : (
              <FiBattery size={14} className="opacity-60" />
            )}
            {batteryLevel !== null && (
              <span className="text-[10px] font-mono opacity-60">
                {batteryLevel}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover View — Window Controls */}
      <div className="absolute right-0 flex items-center gap-0 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
        <button
          onClick={minimize}
          className="p-3 hover:bg-white/10 transition-colors"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <FiMinus size={14} />
        </button>

        <button
          onClick={toggleMaximize}
          className="p-3 hover:bg-white/10 transition-colors"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          {isMaximized ? <FiCopy size={14} /> : <FiSquare size={14} />}
        </button>

        <button
          onClick={close}
          className="p-3 hover:bg-rose-600 transition-colors rounded-bl-sm"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
}
