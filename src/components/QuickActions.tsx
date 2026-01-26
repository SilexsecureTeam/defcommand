import { ActionIcon } from "./dashboard/CallComponents";
import {
  PhoneForwarded,
  Hexagon,
  Wifi,
  User,
  Bluetooth,
  Satellite,
  Radio as WalkieTalkie,
  Settings,
} from "lucide-react";

const QuickActions = () => {
  return (
    <div className=" flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-white ml-1">
          Quick Actions
        </span>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          }}
        >
          <ActionIcon Icon={PhoneForwarded} label="Call" active />
          <ActionIcon Icon={Hexagon} label="Camera" />
          <ActionIcon Icon={Wifi} label="WiFi" />
          <ActionIcon Icon={User} label="Account" />
          <ActionIcon Icon={Bluetooth} label="Bluetooth" />
          <ActionIcon Icon={Satellite} label="Satellite" />
          <ActionIcon Icon={WalkieTalkie} label="WalkieTalkie" />
          <ActionIcon Icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-secondary text-oliveDark p-6 rounded-xl shadow-tactical">
        <h4 className="font-bold text-[16px] mb-2 tracking-tight leading-tight">
          Defcomm Meet Defence Signal
        </h4>
        <p className="text-[14px] font-medium leading-relaxed opacity-80">
          The Defcomm team is scheduled to meet with the Army Signal
          Intelligence Corps on April 22, 2025, at the Signal Office in Lagos...
        </p>
      </div>
      <div className="flex gap-1 justify-center">
        <div className="w-4 h-2 bg-oliveGreen rounded-full" />
        <div className="w-2 h-2 bg-oliveGreen/30 rounded-full" />
        <div className="w-2 h-2 bg-oliveGreen/30 rounded-full" />
      </div>
    </div>
  );
};

export default QuickActions;
