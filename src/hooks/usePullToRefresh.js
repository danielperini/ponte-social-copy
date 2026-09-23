import { useState, useEffect, useRef } from "react";

/**
 * Lightweight native-style pull-to-refresh for touch devices.
 * Activates only when the window is scrolled to the top, so it never conflicts
 * with the fixed Navbar or inner scrollers (e.g. the ConsultantCard list).
 *
 * @param {() => Promise<void>|void} onRefresh called when the pull passes the threshold
 * @param {{ threshold?: number, max?: number }} opts
 */
export function usePullToRefresh(onRefresh, { threshold = 70, max = 110 } = {}) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startY = useRef(0);
  const active = useRef(false);
  const dist = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (typeof window === "undefined" || !("ontouchstart" in window)) return;

    const onTouchStart = (e) => {
      if (window.scrollY > 0 || refreshingRef.current) return;
      startY.current = e.touches[0].clientY;
      active.current = true;
    };

    const onTouchMove = (e) => {
      if (!active.current || refreshingRef.current) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        dist.current = 0;
        setPull(0);
        return;
      }
      // Apply light resistance so the indicator feels native.
      dist.current = Math.min(max, dy * 0.5);
      setPull(dist.current);
    };

    const onTouchEnd = async () => {
      if (!active.current) return;
      active.current = false;
      if (dist.current >= threshold) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPull(threshold);
        try {
          await onRefreshRef.current?.();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          setPull(0);
          dist.current = 0;
        }
      } else {
        setPull(0);
        dist.current = 0;
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [threshold, max]);

  return { pull, refreshing };
}