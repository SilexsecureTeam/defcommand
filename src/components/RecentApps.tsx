import { AppSquare } from "./dashboard/CallComponents";
import missCall from "../assets/miss-call.png";
import store from "../assets/store.png";
import defcomm from "../assets/defcomm.png";
const RecentApps = () => {
  return (
    <div className="lg:col-span-3 bg-oliveLight/40 rounded-xl p-5 border border-white/5 shadow-tactical h-full">
      <h3 className="text-xl font-semibold mb-6 text-center">Recent Apps</h3>
      <div className="flex flex-wrap justify-center gap-3">
        <AppSquare icon={store} />
        <AppSquare icon={missCall} link="/dashboard/call-center" />
        <AppSquare icon={defcomm} />
      </div>
    </div>
  );
};

export default RecentApps;
