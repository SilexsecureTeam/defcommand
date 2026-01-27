import TelemetryBox from "./TelemetryBox";
import { formatTime } from "../../utils/formmaters";

export default function TelemetryPanel({ telemetry }: any) {
  return (
    <div className="row-span-2 bg-oliveLight py-10 px-5">
      <div className="overflow-hidden relative grid grid-cols-2 gap-4">
        <div className="flex bg-[#0D1204] text-[10px] uppercase font-semibold mb-2 border-b border-[#4A5A2A]">
          <div className="grow flex items-center justify-center hover:bg-oliveHover/30 px-4 py-2 border-r border-[#4A5A2A] text-white">
            Video
          </div>
          <div className="grow flex items-center justify-center hover:bg-oliveHover/30 px-4 py-2 bg-[#98C630] text-black">
            Photo
          </div>
          <div className="grow flex items-center justify-center hover:bg-oliveHover/30 px-4 py-2 text-white">
            Listen
          </div>
        </div>
        <div className="flex items-center justify-between text-sm lg:text-lg text-white">
          <p>Real time view</p>
          <p>Display Resolution</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600"
          className="w-full h-full object-cover opacity-60 rounded-lg"
          alt="Drone View"
        />
        <div className="grid grid-cols-3 grid-rows-[100px] gap-2">
          <TelemetryBox label="Speed" value={`${telemetry.speed} KPH`} />
          <TelemetryBox label="Lens" value={`${telemetry.lens} MM`} />
          <TelemetryBox label="Height" value={`${telemetry.alt} M`} />
          <TelemetryBox label="Sens" value={`ISO ${telemetry.iso}`} />

          <TelemetryBox
            label="Track Time"
            value={formatTime(telemetry.trackTime)}
          />
          <TelemetryBox
            label="Shutter"
            value={telemetry.shutter}
            color="text-red-500"
          />
          <TelemetryBox label="Sens" value={`ISO ${telemetry.iso}`} />
          <TelemetryBox
            label="Uptime"
            value={formatTime(telemetry.timestamp)}
          />
          <TelemetryBox
            label="Shutr"
            value={telemetry.shutter}
            color="text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
