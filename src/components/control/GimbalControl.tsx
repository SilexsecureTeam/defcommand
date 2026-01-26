import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DPadBtn from "./DPadBtn";

export default function GimbalControl({ camPos, setCamPos }: any) {
  return (
    <div className="bg-oliveLight border border-[#4A5A2A] rounded p-6 aspect-square flex items-center justify-center">
      <div className="grid grid-cols-3 grid-rows-3 gap-3 place-items-center">
        {/* UP — col 2, row 1 */}
        <div className="col-start-2 row-start-1">
          <DPadBtn
            icon={<ChevronUp size={28} />}
            position="top"
            onClick={() =>
              setCamPos((p: { y: number }) => ({ ...p, y: p.y + 1 }))
            }
          />
        </div>

        {/* LEFT — col 1, row 2 */}
        <div className="col-start-1 row-start-2">
          <DPadBtn
            position="left"
            icon={<ChevronLeft size={28} />}
            onClick={() =>
              setCamPos((p: { x: number }) => ({ ...p, x: p.x - 1 }))
            }
          />
        </div>

        {/* CENTER — col 2, row 2 */}
        <div className="col-start-2 row-start-2 flex items-center justify-center text-[12px] text-white font-bold tracking-wider">
          {camPos.x},{camPos.y}
        </div>

        {/* RIGHT — col 3, row 2 */}
        <div className="col-start-3 row-start-2">
          <DPadBtn
            position="right"
            icon={<ChevronRight size={28} />}
            onClick={() =>
              setCamPos((p: { x: number }) => ({ ...p, x: p.x + 1 }))
            }
          />
        </div>

        {/* DOWN — col 2, row 3 */}
        <div className="col-start-2 row-start-3">
          <DPadBtn
            position="bottom"
            icon={<ChevronDown size={28} />}
            onClick={() =>
              setCamPos((p: { y: number }) => ({ ...p, y: p.y - 1 }))
            }
          />
        </div>
      </div>
    </div>
  );
}
