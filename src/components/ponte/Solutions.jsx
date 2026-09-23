import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageProvider";

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay },
});

export default function Solutions() {
  const { t } = useTranslation();
  const items = t("solutions.items");
  const soc = t("solutions.societar");

  return (
    <section id="solucoes" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-14">
          <motion.span {...fade(0)} className="text-accent text-sm font-medium tracking-[0.22em] uppercase mb-5 block">
            {t("solutions.kicker")}
          </motion.span>
          <motion.h2 {...fade(0.05)} className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-[1.08] tracking-tight text-balance">
            {t("solutions.title")}
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-5 text-foreground/70 text-base lg:text-[17px] leading-relaxed">
            {t("solutions.intro")}
          </motion.p>
        </div>

        <div className="space-y-8">
          {items.map((it, i) => (
            <motion.div key={it.name} {...fade(i * 0.05)} className="grid lg:grid-cols-12 gap-4 lg:gap-10 border-t border-accent/30 pt-8">
              <div className="lg:col-span-4">
                <h3 className="font-display text-2xl lg:text-3xl text-foreground leading-tight">{it.name}</h3>
                <p className="text-accent text-sm font-medium tracking-wide mt-2">{it.subtitle}</p>
              </div>
              <div className="lg:col-span-8">
                <p className="text-foreground/75 text-[15px] leading-relaxed">{it.text}</p>
                <p className="mt-4 text-foreground/55 text-sm tracking-[0.18em] uppercase">{t("solutions.forWhom")}</p>
                <p className="text-foreground/70 text-sm mt-1 leading-relaxed">{it.audience}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fade(0.1)} className="mt-16 grid lg:grid-cols-12 gap-6 lg:gap-10 border-t border-accent/30 pt-10">
          <div className="lg:col-span-4">
            <a href="https://scambioia.base44.app" target="_blank" rel="noopener noreferrer" className="block">
              <img
                src="/images/9aea63e71_ChatGPTImage14desetde202617_28_23.png"
                alt={soc.name}
                className="h-auto max-w-full lg:h-[205px] w-auto object-contain transition-opacity hover:opacity-80"
              />
            </a>
            <p className="text-accent text-sm font-medium tracking-wide mt-3">{soc.subtitle}</p>
          </div>
          <div className="lg:col-span-8">
            {soc.text.split("\n\n").map((para, i) => (
              <p key={i} className="text-foreground/75 text-[15px] leading-relaxed mb-4 last:mb-0">
                {para.split(/(SCAMBIO\.IA)/g).map((part, j) =>
                  part === "SCAMBIO.IA" ? (
                    <a key={j} href="https://scambioia.base44.app" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">
                      {part}
                    </a>
                  ) : (
                    part
                  )
                )}
              </p>
            ))}
            <p className="mt-4 text-foreground/55 text-sm tracking-[0.18em] uppercase">{t("solutions.forWhom")}</p>
            <p className="text-foreground/70 text-sm mt-1 leading-relaxed">{soc.audience}</p>
          </div>
        </motion.div>
      </div>

    </section>
  );
}