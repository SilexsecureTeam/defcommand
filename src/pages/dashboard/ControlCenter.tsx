import { useState, useMemo, useEffect } from "react";
import { reverseGeocode } from "../../utils/reverseGeocode";
import { useFleetTracking } from "../../hooks/useFleetTracking";
import useChat from "../../hooks/useChat";
import EmergencyOverlay from "../../components/control/EmergencyOverlay";
import SidebarNav from "../../components/control/SidebarNav";
import TacticalMap from "../../components/control/TacticalMap";
import TelemetryPanel from "../../components/control/TelemetryPanel";
import AssetInfoPanel from "../../components/control/AssetInfoPanel";
import GimbalControl from "../../components/control/GimbalControl";
import HeaderBar from "../../components/control/HeaderBar";
import { LocationData } from "../../utils/types/location";

const makeGeoKey = (lat: number, lng: number) =>
  `${lat.toFixed(4)}:${lng.toFixed(4)}`;

export default function TacticalControlCenter() {
  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();
  const { assets: liveAssets, isConnected } = useFleetTracking();

  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [camPos, setCamPos] = useState({ x: 0, y: 0 });

  // Store location objects keyed by contact + lat/lng
  const [locations, setLocations] = useState<Record<string, LocationData>>({});

  // Merge contacts with live asset info + location object
  const mergedAssets = useMemo(() => {
    if (!contacts) return [];

    return contacts
      .filter((c: any) => liveAssets[c.contact_id_encrypt])
      .map((c: any) => {
        const live = liveAssets[c.contact_id_encrypt];
        const geoKey = `${c.contact_id_encrypt}:${makeGeoKey(live.lat, live.lng)}`;

        return {
          ...c,
          id: c.contact_id_encrypt,
          lat: live.lat,
          lng: live.lng,
          speed: live.speed,
          heading: live.heading,
          trackTime: live.time_string,
          timestamp: live.timestamp,
          location: locations[geoKey] || null, // will be populated by effect
        };
      });
  }, [contacts, liveAssets, locations]);
  // Reverse-geocode all merged assets
  useEffect(() => {
    if (!mergedAssets.length) return;

    mergedAssets.forEach((asset: any) => {
      const geoKey = `${asset.id}:${makeGeoKey(asset.lat, asset.lng)}`;

      if (locations[geoKey]) return; // already cached

      reverseGeocode(asset.lat, asset.lng).then((loc) => {
        setLocations((prev) => ({ ...prev, [geoKey]: loc }));
      });
    });
  }, [mergedAssets]);

  const selectedAsset =
    mergedAssets.find((a: any) => a.id === selectedId) || mergedAssets[0];

  // Telemetry panel: show location as a short string
  const telemetry = {
    speed: selectedAsset?.speed ?? 0,
    alt: 0,
    iso: 0,
    lens: 0,
    shutter: "—",
    trackTime: selectedAsset?.trackTime ?? "—",
    timestamp: selectedAsset?.timestamp ?? "--",
  };

  return (
    <div
      className={`min-h-screen p-4 pt-10 font-mono ${
        isEmergency ? "bg-[#2a0505]" : "bg-[#1A2208]"
      }`}
    >
      {isEmergency && (
        <EmergencyOverlay onAbort={() => setIsEmergency(false)} />
      )}
      <HeaderBar isConnected={isConnected} />
      <div className="grid grid-cols-12 gap-4">
        <SidebarNav />

        <main className="col-span-8 grid grid-rows-5 gap-4">
          <TacticalMap
            assets={mergedAssets}
            isConnected={isConnected}
            onEmergency={() => setIsEmergency(true)}
            onSelect={setSelectedId}
            selectedAsset={selectedAsset}
          />

          <TelemetryPanel telemetry={telemetry} />
        </main>

        <aside className="col-span-3 flex flex-col gap-4">
          <AssetInfoPanel asset={selectedAsset} />
          <GimbalControl camPos={camPos} setCamPos={setCamPos} />
        </aside>
      </div>
    </div>
  );
}
