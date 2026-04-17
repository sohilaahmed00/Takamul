import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { Screen } from "@/constants/data";

export default function Sidebar() {
  const { screen, setScreen } = usePos();

  return (
    <div className="w-16 bg-[#000052] border-r border-gray-100 flex flex-col items-center py-3 gap-0.5 shrink-0">
      <div className="flex-1" />

      {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setScreen(id as Screen)}
          className={`cursor-pointer py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 ease-in-out
            ${screen === id ? "bg-primary/10 border border-primary/20" : "bg-transparent hover:bg-primary/5 border border-transparent"}`}
          style={{ width: 52 }}
        >
          <Icon size={18} strokeWidth={screen === id ? 2.5 : 1.8} className={`transition-colors duration-200 ${screen === id ? "text-primary" : "text-white"}`} />
          <span className={`transition-colors duration-200 ${screen === id ? "text-primary font-bold" : "text-white"}`} style={{ fontSize: 9 }}>
            {label}
          </span>
        </button>
      ))}

      <div className="flex-1" />

    
    </div>
  );
}
