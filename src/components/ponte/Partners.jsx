import React from "react";
import { motion } from "framer-motion";
import PartnerLogo from "./PartnerLogo";
import { useTranslation } from "@/i18n/LanguageProvider";

const PARTNERS = [
  {
    name: "Instituto Frazoli",
    url: "/images/4f8c4d777_WhatsAppImage2026-09-11at130739FlatLay.png",
    removeWhite: false,
  },
  {
    name: "ima",
    url: "/images/bb5f51af4_FlatLay-10fa5f03-5e32-44c4-b936-2ce393e6afec.jpg",
    removeWhite: true,
  },
  {
    name: "Perini",
    url: "/images/5a2405ae1_perini_transparente2.png",
    removeWhite: false,
    heightClass: "h-[76px] lg:h-[102px]",
  },
];

const fade = (delay) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Partners() {
  const { t } = useTranslation();

  return (
    <section id="rede-parceira" className="py-24 lg:py-32 bg-[#F6F6F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-14">
          <motion.span {...fade(0)} className="text-[#A67C00] text-xs font-medium tracking-[0.22em] uppercase mb-5 block">
            {t("partners.kicker")}
          </motion.span>
          <motion.h2 {...fade(0.05)} className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#073050] leading-[1.08] tracking-tight text-balance">
            {t("partners.title")}
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-5 text-[#073050]/70 text-base lg:text-[17px] leading-relaxed">
            {t("partners.intro")}
          </motion.p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
          {PARTNERS.map((p, i) => (
            <motion.div key={p.name} {...fade(i * 0.08)} className={`flex items-center justify-center ${p.heightClass || "h-24 lg:h-32"}`}>
              <PartnerLogo src={p.url} alt={p.name} removeWhite={p.removeWhite} className="h-full w-auto max-w-[260px]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}