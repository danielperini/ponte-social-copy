import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageProvider";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ConsultantCard from "./ConsultantCard";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const PROFILE_ORDER = [
  "Ana Carolina de Moura Maciel",
  "Patricia Abreu",
  "Daniel Perini",
  "Bernardo Pinheiro Moreira Lage",
];

function orderByProfile(arr) {
  const sorted = [...arr];
  sorted.sort((a, b) => {
    const ia = PROFILE_ORDER.indexOf(a.name);
    const ib = PROFILE_ORDER.indexOf(b.name);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return sorted;
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Team() {
  const { t } = useTranslation();
  // Randomize the order on every load so the carousel starts on a different consultant.
  const consultants = useMemo(() => orderByProfile(t("team.consultants")), [t]);
  const [api, setApi] = useState(null);
  const { ref, active } = useSectionVisibility();

  // Auto-rotate every 10 seconds — paused when the section is off-screen or the
  // tab/app is hidden, to save battery in Android WebView.
  useEffect(() => {
    if (!api || !active) return;
    const id = setInterval(() => api.scrollNext(), 10000);
    return () => clearInterval(id);
  }, [api, active]);

  const labels = {
    educationTitle: t("team.educationTitle"),
    certsTitle: t("team.certsTitle"),
    complementaryTitle: t("team.complementaryTitle"),
    competenciesTitle: t("team.competenciesTitle"),
    specialtiesTitle: t("team.specialtiesTitle"),
    seeFull: t("team.seeFull"),
    hideFull: t("team.hideFull"),
    ongoing: t("team.ongoingLabel"),
    linkedinCta: t("team.linkedinCta"),
    profileNote: t("team.profileNote"),
  };

  return (
    <section ref={ref} id="quem-constroi" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <motion.span {...fade(0)} className="text-accent text-sm font-medium tracking-[0.22em] uppercase mb-5 block">
              {t("team.kicker")}
            </motion.span>
            <motion.h2 {...fade(0.05)} className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-[1.08] tracking-tight text-balance">
              {t("team.title")}
            </motion.h2>
            <motion.p {...fade(0.1)} className="mt-6 text-foreground/75 text-base lg:text-[17px] leading-relaxed">
              {t("team.p1")}
            </motion.p>

            <motion.div {...fade(0.15)} className="mt-8 border-l-2 border-accent pl-5">
              <h3 className="font-display text-xl text-foreground mb-2">{t("team.experienceTitle")}</h3>
              <p className="text-foreground/70 text-[15px] leading-relaxed">{t("team.experienceText")}</p>
            </motion.div>

            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <motion.div {...fade(0.2)} className="border-t border-foreground/12 pt-4">
                <h4 className="font-display text-lg text-foreground">{t("team.nucleusTitle")}</h4>
                <p className="mt-1.5 text-foreground/65 text-sm leading-relaxed">{t("team.nucleusText")}</p>
              </motion.div>
              <motion.div {...fade(0.25)} className="border-t border-foreground/12 pt-4">
                <h4 className="font-display text-lg text-foreground">{t("team.networkTitle")}</h4>
                <p className="mt-1.5 text-foreground/65 text-sm leading-relaxed">{t("team.networkText")}</p>
              </motion.div>
            </div>

            <motion.p {...fade(0.3)} className="mt-8 font-display italic text-accent text-xl font-light">
              {t("team.closing")}
            </motion.p>
          </div>

          <motion.div {...fade(0.15)} className="lg:col-span-5">
            <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
              <CarouselContent>
                {consultants.map((c, i) => (
                  <CarouselItem key={i}>
                    <ConsultantCard p={c} labels={labels} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex lg:hidden items-center justify-center gap-3 mt-4 select-none [-webkit-user-select:none]">
                <CarouselPrevious className="static left-auto top-auto translate-y-0 h-10 w-10 min-h-[44px] min-w-[44px] rounded-full bg-background border border-secondary/40 shadow-sm hover:bg-secondary/20 transition-transform active:scale-90" />
                <CarouselNext className="static left-auto top-auto translate-y-0 h-10 w-10 min-h-[44px] min-w-[44px] rounded-full bg-background border border-secondary/40 shadow-sm hover:bg-secondary/20 transition-transform active:scale-90" />
              </div>
              <CarouselPrevious className="hidden lg:flex -left-12 top-1/2 -translate-y-1/2 h-9 w-9 min-h-[44px] min-w-[44px] rounded-full bg-background border border-secondary/40 shadow-sm hover:bg-secondary/20 transition-transform active:scale-90 z-10" />
              <CarouselNext className="hidden lg:flex -right-12 top-1/2 -translate-y-1/2 h-9 w-9 min-h-[44px] min-w-[44px] rounded-full bg-background border border-secondary/40 shadow-sm hover:bg-secondary/20 transition-transform active:scale-90 z-10" />
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}