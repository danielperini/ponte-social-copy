import React from "react";
import { motion } from "framer-motion";
import { Award, Target, BarChart3, Globe } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

const ITEMS = [
  { Icon: Award, key: "esg" },
  { Icon: Target, key: "ods" },
  { Icon: BarChart3, key: "gri" },
  { Icon: Globe, key: "pacto" },
];

export default function Certifications() {
  const { t } = useTranslation();

  return (
    <section className="bg-navy border-y border-gold/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-14">
        <div className="flex flex-col items-center text-center mb-9">
          <span className="h-px w-10 bg-gold mb-5" />
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-display text-xl sm:text-2xl font-light text-[#FFFFFF] tracking-tight"
          >
            {t("certifications.title")}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 text-sm text-[#FFFFFF]/60 max-w-2xl leading-relaxed"
          >
            {t("certifications.intro")}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {ITEMS.map(({ Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-4">
                <span className="absolute inset-0 rounded-full border border-gold/40" />
                <span className="absolute inset-0 rounded-full border border-gold/20 scale-[1.18]" />
                <span className="relative w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center">
                  <Icon size={26} className="text-gold" strokeWidth={1.5} />
                </span>
              </div>
              <span className="font-display text-base text-[#FFFFFF] tracking-wide">
                {t(`certifications.items.${key}.label`)}
              </span>
              <span className="mt-1 text-sm text-[#FFFFFF]/50 leading-relaxed max-w-[180px]">
                {t(`certifications.items.${key}.desc`)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}