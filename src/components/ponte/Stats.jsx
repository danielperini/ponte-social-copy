import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageProvider";

const STATS = [
  { value: 20, suffix: "+" },
  { value: 4, suffix: "" },
  { value: 9, suffix: "" },
  { text: true },
];

function CountUp({ to, duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(step);
      else setVal(to);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}</span>;
}

export default function Stats() {
  const { t } = useTranslation();
  const items = t("stats.items");

  return (
    <section className="relative py-16 lg:py-20 bg-secondary/15 border-y border-secondary/35">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center lg:text-left"
            >
              <div className="font-display text-4xl lg:text-5xl font-light text-foreground tracking-tight">
                {s.text ? (
                  <span>{items[i].text}</span>
                ) : (
                  <span>
                    <CountUp to={s.value} />
                    {s.suffix}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm lg:text-sm tracking-[0.14em] uppercase text-foreground/55">
                {items[i].label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}