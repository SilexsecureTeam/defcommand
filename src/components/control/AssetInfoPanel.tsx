import StatusRow from "./StatusRow";
import truck from "../../assets/command/truck.svg";
import { useAddress } from "../../hooks/useAddress";
import { formatTime } from "../../utils/formmaters";

export default function AssetInfoPanel({ asset }: any) {
  const { data: location, isLoading } = useAddress(asset?.lat, asset?.lng);

  if (!asset) return null;

  return (
    <div className="bg-black/70 border border-[#4A5A2A] rounded p-6 mb-10 flex-1 shadow-xl relative">
      <h2 className="text-2xl font-light mb-1 text-white tracking-tighter uppercase">
        {asset.contact_name} INFO
      </h2>

      <p className="text-oliveGreen text-xl font-bold truncate">
        Unit ID: {asset.contact_id}
      </p>
      <p className="text-xs text-secondary mb-4">
        Contact: {asset.contact_phone}
      </p>

      {/* Location Field - Updated to use TanStack data */}
      <div className="bg-[#1E270A]/60 border border-[#4A5A2A] rounded px-4 py-3 mb-6">
        <p className="text-[10px] uppercase tracking-widest text-oliveGreen">
          Current Location
        </p>
        <p className="text-sm text-white font-medium line-clamp-2">
          {isLoading
            ? "Resolving HQ..."
            : location?.display_name || "Location Unknown"}
        </p>
      </div>

      <div className="flex justify-center py-4 border-t-3 border-oliveLight">
        <div className="relative">
          <img src={truck} className="w-40 opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-[#98C630]/40 animate-scan" />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <StatusRow label="Engine Status" value="OPTIMAL" />
        <StatusRow label="Comm Link" value="STABLE" />
        <StatusRow label="Fuel Mass" value="82%" color="text-yellow-500" />
        <StatusRow
          label="Speed"
          value={`${asset?.speed?.toFixed(4) ?? 0} km/h`}
        />
        <StatusRow label="Heading" value={`${asset.heading ?? 0}°`} />
        <StatusRow
          label="Last Update"
          value={formatTime(asset?.trackTime) ?? "—"}
        />
      </div>
    </div>
  );
}
