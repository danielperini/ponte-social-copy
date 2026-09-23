import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

const HERO_IMAGES = [
  { url: "/images/5410ea027_WhatsAppImage2026-09-11at092845.jpeg", subject: "left" },
  { url: "/images/2d8280104_ChatGPTImage14desetde202623_14_23.png", subject: "left" },
  { url: "/images/9b9a22d3e_ChatGPTImage14desetde202623_17_05.png", subject: "right" },
  { url: "/images/a8a78f94c_ChatGPTImage14desetde202623_24_38.png", subject: "right" },
  { url: "/images/435a7692b_ChatGPTImage15desetde202611_49_08.png", subject: "left" },
];

function scrollTo(target) {
  const el = document.getElementById(target);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Hero() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const heroImg = useMemo(() => {
    const last = Number(sessionStorage.getItem("ponte_hero_last") ?? -1);
    let idx;
    do {
      idx = Math.floor(Math.random() * HERO_IMAGES.length);
    } while (idx === last && HERO_IMAGES.length > 1);
    sessionStorage.setItem("ponte_hero_last", String(idx));
    return HERO_IMAGES[idx];
  }, []);
  const textRight = heroImg.subject === "left";
  useEffect(() => {
    const img = new Image();
    img.src = heroImg.url;
    img.onload = () => setImgLoaded(true);
    setMounted(true);
  }, [heroImg]);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-navy">
      <div
        className={`absolute inset-0 bg-navy overflow-hidden transition-opacity duration-700 ${imgLoaded ? "opacity-0" : "opacity-100"}`}
      >
        <img src={heroImg.url} alt="" aria-hidden className="h-full w-full object-cover scale-110 blur-2xl brightness-50" />
      </div>
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={mounted && imgLoaded ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img src={heroImg.url} alt={t("hero.imgAlt")} onLoad={() => setImgLoaded(true)} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#073050]/80 via-[#073050]/60 to-[#073050]/92" />
        <div className="absolute top-0 left-0 w-[42%] h-[40%] bg-gradient-to-br from-[#073050]/85 via-[#073050]/40 to-transparent pointer-events-none" />
      </motion.div>

      <div className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-28 flex ${textRight ? "justify-end" : "justify-start"}`}>
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.7 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#A8B7A0] text-[10px] sm:text-sm font-medium tracking-[0.1em] sm:tracking-[0.2em] uppercase mb-6"
          >
            <span className="h-px w-6 sm:w-8 bg-[#A8B7A0]" />
            {t("hero.tag1")} · <span className="whitespace-nowrap">{t("hero.tag2")} · {t("hero.tag3")}</span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.5rem] sm:text-5xl lg:text-[3.4rem] font-normal text-[#FFFFFF] leading-[1.06] tracking-tight text-balance drop-shadow-[0_2px_24px_rgba(7,48,80,0.55)]"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-[#FFFFFF]/80 text-[15px] sm:text-base font-medium leading-relaxed max-w-3xl"
          >
            {t("hero.description")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-6 font-display italic text-[#A8B7A0]/90 text-base sm:text-lg font-normal leading-snug max-w-3xl"
          >
            {t("hero.tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => scrollTo("construcoes")}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#A8B7A0] px-7 py-3 text-sm font-semibold tracking-[0.12em] uppercase text-[#073050] transition-all hover:bg-[#1B562A] hover:text-[#FFFFFF] select-none [-webkit-user-select:none]"
            >
              {t("hero.cta")}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={() => scrollTo("a-ponte")}
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 min-h-[44px] min-w-[44px] justify-center text-[#FFFFFF]/60 hover:text-[#A4B29B] transition-colors select-none [-webkit-user-select:none]"
      >
        <span className="text-sm font-medium tracking-[0.22em] uppercase">{t("hero.scroll")}</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.button>
    </section>
  );
}