import React from "react";
import { motion } from "framer-motion";
import { Radio, Factory, Mountain, TreePine } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

const ICONS = [Radio, Factory, Mountain, TreePine];

export default function Sectors() {
  const { t } = useTranslation();
  const list = t("sectors.list");

  return (
    <section className="py-14 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-gold text-xs font-medium tracking-[0.22em] uppercase mb-8 text-center">
          {t("sectors.kicker")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 lg:gap-x-16 gap-y-6">
          {list.map((label, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-center gap-3 text-foreground"
              >
                <Icon size={22} className="text-gold" />
                <span className="font-display text-lg lg:text-xl font-medium tracking-tight">
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}