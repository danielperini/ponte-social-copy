import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageProvider";

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay },
});

export default function ReputationBlock() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div {...fade(0)} className="max-w-3xl">
          <span className="inline-block h-px w-10 bg-[#A8B7A0] mb-6" />
          <motion.h2
            {...fade(0.05)}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-[#FFFFFF] leading-[1.15] tracking-tight text-balance"
          >
            {t("reputation.title")}
          </motion.h2>
        </motion.div>

        <div className="mt-10 max-w-3xl space-y-5">
          <motion.p {...fade(0.1)} className="text-[#FFFFFF]/75 text-[15px] lg:text-base leading-relaxed">
            {t("reputation.p1")}
          </motion.p>
          <motion.p {...fade(0.15)} className="text-[#FFFFFF]/75 text-[15px] lg:text-base leading-relaxed">
            {t("reputation.p2")}
          </motion.p>
          <motion.p {...fade(0.2)} className="text-[#A8B7A0] text-[15px] lg:text-base leading-relaxed font-medium">
            {t("reputation.p3")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}