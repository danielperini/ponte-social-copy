import React from "react";
import { motion } from "framer-motion";
import { Eye, Lightbulb, Share2, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

const ICONS = [Eye, Lightbulb, Share2, Sparkles];

export default function HowWeWork() {
  const { t } = useTranslation();
  const steps = t("howWeWork.steps");

  return (
    <section className="relative py-24 lg:py-32 bg-navy overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #A4B29B 0, transparent 40%), radial-gradient(circle at 80% 70%, #A4B29B 0, transparent 40%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16 lg:mb-24">
          <span className="text-[#A8B7A0] text-xs font-medium tracking-[0.22em] uppercase mb-5 block">
            {t("howWeWork.kicker")}
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-light text-[#FFFFFF] leading-[1.1] tracking-tight text-balance">
            {t("howWeWork.title")}
          </h2>
        </div>

        <div className="relative">
          <svg
            className="absolute -top-14 left-0 w-full h-10 pointer-events-none"
            viewBox="0 0 1200 50"
            preserveAspectRatio="none"
            fill="none"
          >
            <motion.path
              d="M60 45 C 380 8, 820 8, 1140 45"
              stroke="#A8B7A0"
              strokeWidth="2"
              strokeDasharray="2 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={s.word}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.18 }}
                  className="text-center md:text-left"
                >
                  <div className="flex md:block items-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-[#A8B7A0]/60 flex items-center justify-center mb-5 shrink-0 mx-auto md:mx-0">
                      <Icon size={22} className="text-[#A8B7A0]" />
                    </div>
                    <span className="font-display text-5xl text-[#FFFFFF]/15 font-light hidden md:block">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-[#FFFFFF] mt-4 mb-2">
                    {s.word}
                  </h3>
                  <p className="text-[#FFFFFF]/50 text-xs tracking-[0.12em] uppercase mb-3 hidden md:block">
                    {s.title}
                  </p>
                  <p className="text-[#FFFFFF]/70 text-[15px] leading-relaxed">{s.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}