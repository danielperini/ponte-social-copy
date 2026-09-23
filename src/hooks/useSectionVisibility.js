import { useEffect, useRef, useState } from "react";

// Tracks whether an element is on-screen AND the document is visible.
// Used to pause expensive timers (e.g. carousel auto-rotate) when off-screen
// or when the tab/app is hidden — critical for Android WebView battery use.
export function useSectionVisibility() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setActive(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    const onVisibility = () => {
      setActive((prev) => {
        const intersecting = io.takeRecords()?.[0]?.isIntersecting ?? false;
        if (document.hidden) return false;
        return intersecting;
      });
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { ref, active };
}