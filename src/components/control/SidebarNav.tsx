import controller from "../../assets/command/controller.svg";
import overview from "../../assets/command/overview.png";
import truck from "../../assets/command/truck.svg";
import map from "../../assets/command/map.svg";
import route from "../../assets/command/route.svg";

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

const NavIcon = ({ icon, label, active = false }: NavItemProps) => (
  <div
    className={`flex flex-col items-center gap-1 cursor-pointer transition-all hover:text-oliveHover hover:bg-oliveLight/30 p-2 ${
      active ? "text-oliveHover bg-oliveLight/40" : "text-white"
    }`}
  >
    <img src={icon} alt={label} className="w-5 h-5 transition-all" />
    <span className="hidden lg:block text-[10px] font-bold tracking-widest">
      {label}
    </span>
  </div>
);

export default function SidebarNav() {
  return (
    <nav className="col-span-1 h-max bg-black/90 rounded-2xl flex flex-col py-8 mt-5 gap-8 items-center shadow-2xl">
      <NavIcon icon={controller} label="Controller" />
      <NavIcon icon={overview} label="Overview" active />
      <NavIcon icon={route} label="Routes" />
      <NavIcon icon={truck} label="Trucks" />
      <NavIcon icon={map} label="Map View" />
    </nav>
  );
}
