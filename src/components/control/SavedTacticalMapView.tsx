import { useEffect, useRef } from "react";
import MapAsset from "./MapAsset";
import emergency from "../../assets/emergency.png";
import truck from "../../assets/command/truck.svg";
import map from "../../assets/command/map.svg";
import call from "../../assets/calls.png";
import { Compass } from "lucide-react";

export default function TacticalMap({
  assets,
  isConnected,
  onEmergency,
  onSelect,
  selectedAsset,
}: any) {
  const mapRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll to selected asset or first asset when assets load
  useEffect(() => {
    if (selectedAsset && selectedRef.current && mapRef.current) {
      // Scroll container so selected asset is centered
      const parent = mapRef.current;
      const child = selectedRef.current;
      const offsetX =
        child.offsetLeft - parent.clientWidth / 2 + child.clientWidth / 2;
      const offsetY =
        child.offsetTop - parent.clientHeight / 2 + child.clientHeight / 2;

      parent.scrollTo({ left: offsetX, top: offsetY, behavior: "smooth" });
    } else if (assets.length && mapRef.current) {
      // Scroll to first asset by default
      const firstAsset =
        mapRef.current.querySelector<HTMLDivElement>("[data-asset-id]");
      if (firstAsset) {
        const offsetX =
          firstAsset.offsetLeft -
          mapRef.current.clientWidth / 2 +
          firstAsset.clientWidth / 2;
        const offsetY =
          firstAsset.offsetTop -
          mapRef.current.clientHeight / 2 +
          firstAsset.clientHeight / 2;
        mapRef.current.scrollTo({
          left: offsetX,
          top: offsetY,
          behavior: "smooth",
        });
      }
    }
  }, [assets, selectedAsset]);

  return (
    <div
      ref={mapRef}
      className="row-span-3 relative bg-[#1A2208] border border-[#4A5A2A] overflow-auto shadow-inner"
    >
      {/* Connection & Alert Control Panel */}
      <div className="absolute top-6 left-6 z-20 space-y-4">
        <div
          className={`bg-[#98C630] text-black px-4 py-2 rounded-lg flex items-center gap-3 text-xs font-black shadow-[0_0_15px_rgba(152,198,48,0.3)]`}
        >
          <div
            className={`w-3 h-3 bg-red-600 rounded-full ${isConnected ? "animate-ping" : ""}`}
          />
          {isConnected ? "Transmitting" : "Signal Lost"}
        </div>

        <section className="flex flex-col gap-3 p-4 bg-[#2B3A1A]/40 backdrop-blur-md border border-[#4A5A2A]/50 rounded-2xl shadow-2xl">
          <button
            onClick={onEmergency}
            className="bg-[#C62828] text-white px-4 py-3 text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 border border-red-500/50 font-bold uppercase tracking-tighter shadow-[0_5px_15px_rgba(198,40,40,0.4)]"
          >
            <img src={emergency} className="w-5" alt="" /> Emergency Alert
          </button>

          <button className="bg-[#0D1204] text-white px-4 py-3 text-xs rounded-xl hover:bg-black transition-all flex items-center gap-3 border border-white/10 font-bold uppercase tracking-tighter">
            <img src={emergency} className="w-5" alt="" /> Send Alert
          </button>

          <button className="bg-linear-to-r from-[#39490D] to-[#0D1204] text-white px-4 py-3 text-xs rounded-xl hover:brightness-110 transition-all flex items-center gap-3 border border-white/5 font-bold uppercase tracking-tighter">
            <img src={call} className="w-5" alt="" /> Secure Call
          </button>
        </section>
      </div>

      {/* Compass */}
      <div className="absolute bottom-8 left-8 opacity-60">
        <div className="relative flex items-center justify-center">
          <Compass
            size={80}
            className="text-white animate-spin-slow stroke-[1px]"
          />
          <div className="absolute inset-0 border border-white/20 rounded-full scale-125"></div>
        </div>
      </div>

      {/* Map Assets */}
      {assets.map((asset: any) => (
        <div
          key={asset.id}
          ref={selectedAsset?.id === asset.id ? selectedRef : null}
          data-asset-id={asset.id}
        >
          <MapAsset asset={asset} onSelect={() => onSelect(asset.id)} />
        </div>
      ))}

      {/* Selected Asset Info Card */}
      {selectedAsset && (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col w-56">
          <div className="bg-[#2B3A1A]/60 backdrop-blur-md border-t border-x border-[#4A5A2A] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-t-2xl w-fit">
            Tracking
          </div>
          <div className="bg-[#0D1204] border border-[#4A5A2A] rounded-b-2xl rounded-tr-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-4">
              <img src={truck} className="w-8 h-8 opacity-80" alt="unit icon" />
              <div>
                <p className="text-white text-lg font-black tracking-tight leading-none uppercase">
                  {selectedAsset?.contact_name || "Unknown"}
                </p>
                <p className="text-[#98C630] text-[10px] font-bold tracking-widest mt-1">
                  UNIT ID: {selectedAsset?.contact_id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              <img src={map} className="w-5 h-5 opacity-40" alt="map pin" />
              <p className="text-[#6B7A41] font-mono text-[11px] leading-tight">
                {selectedAsset?.lat?.toFixed(6)}
                <br />
                {selectedAsset?.lng?.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #4A5A2A 1px, transparent 1px),linear-gradient(to bottom, #4A5A2A 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(to right, #4A5A2A 1px, transparent 1px),linear-gradient(to bottom, #4A5A2A 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        />
      </div>
    </div>
  );
}
