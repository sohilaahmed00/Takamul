import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/constants/data";
import { usePos } from "@/context/PosContext";
import type { Screen } from "@/constants/data";

export default function Sidebar() {
  const { screen, setScreen } = usePos();

  return (
    <div className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-3 gap-0.5 shrink-0">
      <div className="flex-1" />

      {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setScreen(id as Screen)}
          className={`py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 ease-in-out
            ${screen === id
              ? "bg-primary/10 border border-primary/20"
              : "bg-transparent hover:bg-primary/5 border border-transparent"
            }`}
          style={{ width: 52 }}
        >
          <Icon
            size={18}
            strokeWidth={screen === id ? 2.5 : 1.8}
            className={`transition-colors duration-200 ${screen === id ? "text-primary" : "text-gray-300"}`}
          />
          <span
            className={`transition-colors duration-200 ${screen === id ? "text-primary font-bold" : "text-gray-300"}`}
            style={{ fontSize: 9 }}
          >
            {label}
          </span>
        </button>
      ))}

      <div className="flex-1" />

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 mb-1">
        <img
          src="https://i.pravatar.cc/32"
          alt="user"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.innerHTML =
              '<div style="width:100%;height:100%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:14px">👤</div>';
          }}
        />
      </div>

      {/* Logout */}
      <button
        className="flex flex-col items-center gap-0.5 py-2 hover:bg-primary/5 rounded-xl border border-transparent transition-all duration-200"
        style={{ width: 52 }}
      >
        <LogOut size={16} strokeWidth={1.8} className="text-primary/30" />
        <span className="text-primary/40" style={{ fontSize: 9 }}>
          Logout
        </span>
      </button>
    </div>
  );
}