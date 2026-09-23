import React from "react";
import { motion } from "framer-motion";
import ConnectingArc from "./ConnectingArc";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function HowWeCross() {
  const { t } = useTranslation();
  const questions = t("howWeCross.questions");

  return (
    <section id="como-atravessamos" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-accent text-xs font-medium tracking-[0.22em] uppercase mb-5 block">
              {t("howWeCross.kicker")}
            </span>
            <h2 className="font-display text-3xl lg:text-5xl font-light text-foreground leading-[1.1] tracking-tight text-balance mb-8">
              {t("howWeCross.title")}
            </h2>
            <p className="text-foreground/75 leading-relaxed mb-6">{t("howWeCross.intro")}</p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 bg-navy rounded-xl p-7 lg:p-8"
            >
              <p className="font-display text-lg lg:text-xl text-[#FFFFFF] leading-relaxed">
                {t("howWeCross.formula1")}
              </p>
              <p className="font-display text-2xl lg:text-3xl text-[#A8B7A0] mt-3 font-light tracking-tight">
                {t("howWeCross.formula2")}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="relative h-16 mb-2 overflow-hidden">
              <ConnectingArc height={64} />
            </div>
            <div className="space-y-5 relative">
              {questions.map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex gap-5 items-start bg-secondary/15 border border-secondary/40 rounded-lg p-6"
                >
                  <span className="font-display text-2xl text-accent font-light shrink-0">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-foreground mb-1">
                      {item.q}
                    </h3>
                    <p className="text-foreground/70 text-[15px]">{item.a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}