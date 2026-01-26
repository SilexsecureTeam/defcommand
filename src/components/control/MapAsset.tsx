import { useState } from "react";
import { X, MapPin, Target, Activity } from "lucide-react";

export default function MapAsset({
  asset,
  onSelect,
}: {
  asset: any;
  onSelect?: () => void;
}) {
  if (!asset) return null;

  const { lat, lng, active, contact_name } = asset;
  const location = asset.location || {};
  const [showModal, setShowModal] = useState(false);

  // Position mapping logic remains consistent with your requirements
  const latLngToMapPosition = (lat: number, lng: number) => {
    const top = `${(1 - (lat - 6.5) / 0.3) * 100}%`;
    const left = `${((lng - 3.3) / 0.3) * 100}%`;
    return { top, left };
  };

  const { top, left } = latLngToMapPosition(lat, lng);

  const addressString = [
    location.neighbourhood,
    location.suburb,
    location.city || location.town || location.village,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div
        className="absolute cursor-pointer group"
        style={{ top, left, transform: "translate(-50%, -50%)" }}
        onClick={() => {
          onSelect?.();
          setShowModal(true);
        }}
      >
        {/* Radar Ring Animation */}
        {active && (
          <div className="absolute inset-0 w-8 h-8 -top-2 -left-2 rounded-full border border-red-500 animate-ping opacity-75" />
        )}

        {/* Tactical Marker */}
        <div
          className={`relative w-4 h-4 rounded-sm rotate-45 border transition-all duration-300 group-hover:scale-125 ${
            active
              ? "bg-red-600 border-red-400"
              : "bg-[#98C630] border-[#1A2208]"
          }`}
        >
          <div className="absolute inset-1 bg-white/20 rounded-full animate-pulse" />
        </div>

        {/* Floating Label (Mini) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#0D1204] text-[#98C630] text-[9px] font-bold px-2 py-0.5 border border-[#4A5A2A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none tracking-widest uppercase">
          {contact_name}
        </div>
      </div>

      {/* --- TACTICAL MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="relative bg-[#0D1204] border-2 border-[#4A5A2A] w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Scanline Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] z-10" />

            {/* Header */}
            <div className="bg-[#1A2208] border-b border-[#4A5A2A] p-4 flex justify-between items-center relative z-20">
              <div className="flex items-center gap-3">
                <Target className="text-[#98C630] animate-pulse" size={20} />
                <div>
                  <h2 className="text-[#98C630] font-black tracking-tighter text-xl uppercase leading-none">
                    Asset Intel
                  </h2>
                  <span className="text-[10px] text-[#6B7A41] font-bold tracking-widest">
                    ENCRYPTED DATA LINK 04
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6B7A41] hover:text-[#98C630] transition-colors p-1 border border-transparent hover:border-[#4A5A2A]"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 relative z-20 font-mono">
              {/* Identity Section */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#1A2208] border border-[#4A5A2A] flex items-center justify-center rounded">
                  <Activity
                    className={active ? "text-red-500" : "text-[#98C630]"}
                    size={32}
                  />
                </div>
                <div>
                  <p className="text-[#6B7A41] text-[10px] uppercase font-bold tracking-widest">
                    Designation
                  </p>
                  <h3 className="text-white text-2xl font-black italic tracking-tighter uppercase">
                    {contact_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${active ? "bg-red-500 animate-ping" : "bg-green-500"}`}
                    />
                    <span className="text-[10px] text-white/70 uppercase">
                      {active ? "Priority Alert" : "Status: Optimal"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A2208]/50 border border-[#2B3A1A] p-3">
                  <p className="text-[#6B7A41] text-[9px] uppercase font-bold mb-1">
                    LATITUDE
                  </p>
                  <p className="text-[#98C630] text-lg font-bold">
                    {lat.toFixed(6)}
                  </p>
                </div>
                <div className="bg-[#1A2208]/50 border border-[#2B3A1A] p-3">
                  <p className="text-[#6B7A41] text-[9px] uppercase font-bold mb-1">
                    LONGITUDE
                  </p>
                  <p className="text-[#98C630] text-lg font-bold">
                    {lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {/* Address Detail */}
              <div className="border-t border-[#2B3A1A] pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-[#6B7A41]" />
                  <span className="text-[#6B7A41] text-[10px] uppercase font-bold tracking-widest">
                    Geospatial Address
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed lowercase italic first-letter:uppercase">
                  {addressString || "No terrestrial address mapping available."}
                </p>
              </div>

              {/* Action Footer */}
              {/* <button
                onClick={() => onSelect?.()}
                className="w-full bg-[#98C630] text-black font-black py-3 uppercase tracking-tighter hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Shield size={18} /> Initiate Intercept Protocol
              </button> */}
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#98C630] z-30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#98C630] z-30" />
          </div>
        </div>
      )}
    </>
  );
}
