// PushTrack — Bottom Navigation
// Design: Minimal Dark Precision / Sports Analytics

import { useLocation } from "wouter";
import {
  Home,
  PlusCircle,
  Target,
  CalendarDays,
  BarChart2,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/",        icon: Home,         label: "Home"    },
  { path: "/log",     icon: PlusCircle,   label: "Log"     },
  { path: "/goals",   icon: Target,       label: "Goals"   },
  { path: "/history", icon: CalendarDays, label: "History" },
  { path: "/stats",   icon: BarChart2,    label: "Stats"   },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-2 max-w-[480px] mx-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
              aria-label={label}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? "#4FFFB0" : "oklch(0.55 0.015 265)" }}
              />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{
                  color: active ? "#4FFFB0" : "oklch(0.55 0.015 265)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
