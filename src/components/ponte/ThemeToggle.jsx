import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/i18n/ThemeProvider";

const OPTIONS = [
  { value: "light", Icon: Sun, label: "Light" },
  { value: "dark", Icon: Moon, label: "Dark" },
  { value: "system", Icon: Monitor, label: "System" },
];

export default function ThemeToggle({ scrolled = false, compact = false, className = "" }) {
  const { theme, setTheme } = useTheme();
  const baseColor = "text-[#FFFFFF]/70 hover:text-[#FFFFFF]";
  const btnSize = compact ? "h-8 w-8" : "min-h-[44px] min-w-[44px]";
  const iconSize = compact ? 14 : 15;
  return (
    <div
      role="group"
      aria-label="Theme"
      className={`flex items-center gap-0.5 select-none [-webkit-user-select:none] ${className}`}
    >
      {OPTIONS.map(({ value, Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={`${btnSize} flex items-center justify-center rounded-full transition-colors ${
              active ? "text-[#477A63]" : baseColor
            }`}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}
    </div>
  );
}