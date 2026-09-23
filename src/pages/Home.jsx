import React, { useEffect } from "react";
import Navbar from "@/components/ponte/Navbar";
import Hero from "@/components/ponte/Hero";
import APonte from "@/components/ponte/APonte";
import Pillars from "@/components/ponte/Pillars";
import HowWeWork from "@/components/ponte/HowWeWork";
import HowWeCross from "@/components/ponte/HowWeCross";
import Solutions from "@/components/ponte/Solutions";
import ReputationBlock from "@/components/ponte/ReputationBlock";
import Team from "@/components/ponte/Team";
import Governance from "@/components/ponte/Governance";
import Partners from "@/components/ponte/Partners";
import Constructions from "@/components/ponte/Constructions";
import Footer from "@/components/ponte/Footer";
import Seo from "@/components/ponte/Seo";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/ponte/PullToRefreshIndicator";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function Home() {
  const { t } = useTranslation();
  const { pull, refreshing } = usePullToRefresh(async () => {
    await new Promise((r) => setTimeout(r, 700));
  });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main > section")).slice(1);
    if (!("IntersectionObserver" in window)) return;
    sections.forEach((s) => s.classList.add("section-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-60px", threshold: 0.05 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-background">
      <Seo title={t("seo.title")} description={t("seo.description")} />
      <PullToRefreshIndicator pull={pull} refreshing={refreshing} />
      <Navbar />
      <main>
        {/* Topo — Atrair */}
        <Hero />
        {/* Meio — Interessar */}
        <APonte />
        {/* Consideração — Avaliar */}
        <Pillars />
        <HowWeWork />
        <HowWeCross />
        <Solutions />
        <ReputationBlock />
        {/* Fundo — Comprar */}
        <Constructions />
        {/* Pós-venda — Fidelizar */}
        <Team />
        <Governance />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}