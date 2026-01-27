import { useState, useMemo } from "react";
import { useFleetTracking } from "../../hooks/useFleetTracking";
import useChat from "../../hooks/useChat";
import SidebarNav from "../../components/control/SidebarNav";
import TacticalMap from "../../components/control/TacticalMap";
import TelemetryPanel from "../../components/control/TelemetryPanel";
import AssetInfoPanel from "../../components/control/AssetInfoPanel";
import GimbalControl from "../../components/control/GimbalControl";
import HeaderBar from "../../components/control/HeaderBar";
import { useEmergency } from "../../context/EmergencyContext";

export default function TacticalControlCenter() {
  const { useFetchContacts } = useChat();
  const { data: contacts } = useFetchContacts();
  const { assets: liveAssets, isConnected } = useFleetTracking();

  const { selectedEmergency, openPanel } = useEmergency();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [camPos, setCamPos] = useState({ x: 0, y: 0 });

  const mergedAssets = useMemo(() => {
    if (!contacts || !liveAssets) return [];

    return contacts
      .filter((c: any) => liveAssets[c.contact_id_encrypt])
      .map((c: any) => {
        const live = liveAssets[c.contact_id_encrypt];
        return {
          ...c,
          id: c.contact_id_encrypt,
          lat: live.lat,
          lng: live.lng,
          speed: live.speed,
          heading: live.heading,
          trackTime: live.time_string,
          timestamp: live.timestamp,
        };
      });
  }, [contacts, liveAssets]);

  const selectedAsset = useMemo(
    () => mergedAssets.find((a: any) => a.id === selectedId) || mergedAssets[0],
    [mergedAssets, selectedId],
  );

  const telemetry = useMemo(
    () => ({
      speed: selectedAsset?.speed ?? 0,
      alt: 0,
      iso: 0,
      lens: 0,
      shutter: "—",
      trackTime: selectedAsset?.trackTime ?? "—",
      timestamp: selectedAsset?.timestamp ?? "--",
    }),
    [selectedAsset],
  );

  return (
    <div
      className={`min-h-screen p-4 pt-10 font-mono ${!!selectedEmergency ? "bg-[#2a0505]" : "bg-[#1A2208]"}`}
    >
      <HeaderBar isConnected={isConnected} />
      <div className="grid grid-cols-12 gap-4">
        <SidebarNav />
        <main className="col-span-8 grid grid-rows-5 gap-4">
          <TacticalMap
            assets={mergedAssets}
            isConnected={isConnected}
            onEmergency={openPanel}
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
