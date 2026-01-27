import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";

import emergency from "../../assets/emergency.png";
import truck from "../../assets/command/truck.svg";
import mapIcon from "../../assets/command/map.svg";
import call from "../../assets/calls.png";
import { Compass } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface TacticalMapProps {
  assets: any[];
  isConnected: boolean;
  onEmergency: () => void;
  onSelect: (id: string) => void;
  selectedAsset?: any;
}

/* Fit map to all asset locations */
function MapFitBounds({ assets }: { assets: any[] }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!assets?.length || hasFitted.current) return;

    const points = assets
      .filter((a) => typeof a.lat === "number")
      .map((a) => [a.lat, a.lng] as [number, number]);

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [120, 120], maxZoom: 17 });
      hasFitted.current = true; // Prevents the map from jumping every time an asset moves
    }
  }, [assets]);

  return null;
}

export default function TacticalMap({
  assets,
  isConnected,
  onEmergency,
  onSelect,
  selectedAsset,
}: TacticalMapProps) {
  const defaultPosition: [number, number] = [6.5244, 3.3792];
  const { selectedEmergency } = useEmergency();

  return (
    <div className="row-span-3 relative bg-[#1A2208] border border-[#4A5A2A] overflow-hidden shadow-inner">
      {/* Connection & Alert Panel */}
      <div className="absolute top-6 left-6 z-20 space-y-4">
        <div className="bg-[#98C630] ml-6 text-black px-4 py-2 rounded-lg flex items-center gap-3 text-xs font-black shadow-[0_0_15px_rgba(152,198,48,0.3)]">
          <div
            className={`w-3 h-3 bg-red-600 rounded-full ${
              isConnected ? "animate-ping" : ""
            } `}
          />
          {isConnected ? "Transmitting" : "Signal Lost"}
        </div>

        <section className="flex flex-col gap-3 mt-5 p-4 bg-[#2B3A1A]/40 backdrop-blur-md border border-[#4A5A2A]/50 rounded-2xl shadow-2xl">
          <button
            onClick={onEmergency}
            className={`bg-[#C62828] text-white px-4 py-3 text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 border border-red-500/50 font-bold uppercase tracking-tighter shadow-[0_5px_15px_rgba(198,40,40,0.4)] ${
              selectedEmergency
                ? "bg-[#C62828] border-red-400 text-white shadow-[0_0_25px_rgba(198,40,40,0.8)] animate-pulse"
                : "bg-[#3b3b3b] border-white/10 text-white/70 hover:brightness-110"
            }`}
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

      {/* Leaflet Map */}
      <MapContainer
        center={defaultPosition}
        zoom={12}
        scrollWheelZoom
        className="absolute inset-0 z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MapFitBounds assets={assets} />

        <MarkerClusterGroup>
          {assets.map((asset) => (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              eventHandlers={{ click: () => onSelect(asset.id) }}
            >
              <Popup>
                <div>
                  <strong>{asset.contact_name || "Unknown"}</strong>
                  <br />
                  {asset.lat.toFixed(6)}, {asset.lng.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Selected Asset Info */}
      {selectedAsset && (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col w-56">
          <div className="bg-[#2B3A1A]/60 backdrop-blur-md border-t border-x border-[#4A5A2A] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-t-2xl w-fit">
            Tracking
          </div>
          <div className="bg-[#0D1204] border border-[#4A5A2A] rounded-b-2xl rounded-tr-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-4">
              <img src={truck} className="w-8 h-8 opacity-80" alt="unit icon" />
              <div>
                <p className="text-white text-lg font-black tracking-tight leading-none uppercase line-clamp-1">
                  {selectedAsset?.contact_name || "Unknown"}
                </p>
                <p className="text-[#98C630] text-[10px] font-bold tracking-widest mt-1">
                  UNIT ID: {selectedAsset?.contact_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              <img src={mapIcon} className="w-5 h-5 opacity-40" alt="map pin" />
              <p className="text-[#6B7A41] font-mono text-[11px] leading-tight">
                {selectedAsset?.lat?.toFixed(6)}
                <br />
                {selectedAsset?.lng?.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
