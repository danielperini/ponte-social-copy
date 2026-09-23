import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageProvider";

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay },
});

export default function Segments() {
  const { t } = useTranslation();
  const items = t("segments.items");
  const [empresas, ...rest] = items;

  return (
    <section id="quem-atendemos" className="py-24 lg:py-28 bg-secondary/15">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-12">
          <motion.span {...fade(0)} className="text-gold text-xs font-medium tracking-[0.22em] uppercase mb-5 block">
            {t("segments.kicker")}
          </motion.span>
          <motion.h2 {...fade(0.05)} className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-[1.08] tracking-tight text-balance">
            {t("segments.title")}
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <motion.div {...fade(0.1)} className="lg:col-span-7 bg-navy text-[#FFFFFF] rounded-2xl p-8 lg:p-10">
            <h3 className="font-display text-2xl lg:text-3xl text-[#FFFFFF] leading-tight">{empresas.title}</h3>
            <p className="mt-3 text-[#FFFFFF]/75 text-[15px] leading-relaxed max-w-xl">{empresas.text}</p>
          </motion.div>
          <div className="lg:col-span-5 grid gap-6 content-start">
            {rest.map((it, i) => (
              <motion.div key={it.title} {...fade(0.15 + i * 0.05)} className="bg-background border border-secondary/40 rounded-2xl p-6 lg:p-7">
                <h3 className="font-display text-xl text-foreground leading-tight">{it.title}</h3>
                <p className="mt-2 text-foreground/70 text-sm leading-relaxed">{it.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}