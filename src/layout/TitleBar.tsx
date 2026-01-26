import { useEffect, useState } from "react";
import {
  FiX,
  FiMinus,
  FiSquare,
  FiCopy,
  FiWifi,
  FiBattery,
  FiBatteryCharging,
} from "react-icons/fi";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTime } from "../utils/useTime";

export default function TitleBar() {
  const appWindow = getCurrentWindow();
  const { formattedTime } = useTime();

  const [isMaximized, setIsMaximized] = useState(false);

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  // Window maximize tracking
  useEffect(() => {
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

  // Real battery + network status
  useEffect(() => {
    let battery: {
      level: number;
      charging: boolean | ((prevState: boolean) => boolean);
      addEventListener: (arg0: string, arg1: { (): void; (): void }) => void;
      removeEventListener: (arg0: string, arg1: { (): void; (): void }) => void;
    };

    async function initBattery() {
      if ("getBattery" in navigator) {
        battery = await (navigator.getBattery as () => Promise<any>)();

        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };

        updateBattery();

        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      }
    }

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    initBattery();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", () => {});
        battery.removeEventListener("chargingchange", () => {});
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

  return (
    <div
      className="fixed top-0 left-0 right-0 z-100000000 flex items-center justify-between h-10 bg-oliveDark/30 text-white px-4 select-none group"
      data-tauri-drag-region
    >
      {/* Idle View — Time (Left) */}
      <div
        className="flex items-center px-2 gap-2 opacity-100 transition-all duration-200 group-hover:opacity-0"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <span className="text-sm font-medium tracking-wide">
          {formattedTime}
        </span>
      </div>

      {/* Idle View — Status (Right) */}
      <div className="flex items-center gap-2 opacity-100 transition-all duration-200 group-hover:opacity-0">
        <FiWifi size={14} className={online ? "opacity-80" : "opacity-30"} />

        {isCharging ? (
          <FiBatteryCharging size={14} className="opacity-80" />
        ) : (
          <FiBattery size={14} className="opacity-80" />
        )}

        {batteryLevel !== null && (
          <span className="text-xs opacity-70">{batteryLevel}%</span>
        )}
      </div>

      {/* Hover View — Window Controls */}
      <div className="absolute right-0 flex items-center gap-1 opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
        <button
          onClick={minimize}
          className="p-2 rounded hover:bg-white/10"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          aria-label="Minimize"
        >
          <FiMinus size={14} />
        </button>

        <button
          onClick={toggleMaximize}
          className="p-2 rounded hover:bg-white/10"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          aria-label="Maximize"
        >
          {isMaximized ? <FiCopy size={14} /> : <FiSquare size={14} />}
        </button>

        <button
          onClick={close}
          className="p-2 rounded-l  hover:bg-red-600"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          aria-label="Close"
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
}
