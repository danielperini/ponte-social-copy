import React from "react";
import { Loader2, ArrowDown } from "lucide-react";

/**
 * Visual indicator for usePullToRefresh. Sits above the fixed Navbar and is
 * only visible while the user is pulling or a refresh is in flight.
 */
export default function PullToRefreshIndicator({ pull = 0, refreshing = false, threshold = 70 }) {
  const pct = refreshing ? 1 : Math.min(1, pull / threshold);
  const visible = pull > 0 || refreshing;

  return (
    <div
      aria-hidden={!visible}
      className="fixed left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200"
      style={{
        top: `calc(env(safe-area-inset-top) + 10px)`,
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, ${refreshing ? 0 : Math.max(-8, pull * 0.2 - 8)}px)`,
      }}
    >
      <div
        className="rounded-full border-2 border-accent/40 border-t-accent flex items-center justify-center bg-background/60 backdrop-blur-sm"
        style={{
          width: 32,
          height: 32,
          transform: `rotate(${Math.round(pct * 360)}deg)`,
        }}
      >
        {refreshing ? (
          <Loader2 className="w-4 h-4 text-accent animate-spin" />
        ) : (
          <ArrowDown className="w-4 h-4 text-accent" />
        )}
      </div>
    </div>
  );
}