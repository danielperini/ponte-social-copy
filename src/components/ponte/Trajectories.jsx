import React, { useState } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";
import PeriniLogo from "./PeriniLogo";

const INSTITUTIONS = [
  { name: "Perini Projetos", descKey: "trajectory.periniProjetos", logo: null, custom: "perini" },
  { name: "Fiat Ultra Artes", descKey: "trajectory.fiatUltraArtes", logo: null },
  { name: "Fábrica do Futuro", descKey: "trajectory.fabricaFuturo", logo: "fabricadofuturo.org.br" },
  { name: "Viaduto das Artes", descKey: "trajectory.meioAdultoArtes", logo: "viadutodasartes.org.br" },
  { name: "Centro de Referência da Juventude", descKey: "trajectory.crj", logo: null },
  { name: "Fundação Municipal de Cultura", descKey: "trajectory.fundacaoMunicipalCultura", logo: "fmc.pbh.gov.br" },
  { name: "Secretaria de Educação de MG", descKey: "trajectory.secretariaEducacaoMG", logo: "educacao.mg.gov.br" },
  { name: "Secretaria de Direitos Humanos de MG", descKey: "trajectory.secretariaDireitosHumanos", logo: null },
  { name: "Fundação ArcelorMittal", descKey: "trajectory.fundacaoArcelor", logo: "arcelormittal.com" },
  { name: "Fundação Renova", descKey: "trajectory.fundacaoRenova", logo: "fundacaorenova.org" },
  { name: "LafargeHolcim", descKey: "trajectory.lafargeHolcim", logo: "holcim.com" },
  { name: "Vivo", descKey: "trajectory.vivo", logo: "vivo.com.br" },
  { name: "Claro Abreu Projetos", descKey: "trajectory.claroAbreu", logo: null },
  { name: "Angra Partners", descKey: "trajectory.angra", logo: "angrapartners.com" },
  { name: "Beija-Flor Tecnologias Sociais", descKey: "trajectory.beijaFlor", logo: "beijaflor.org.br" },
  { name: "Vale", descKey: "trajectory.vale", logo: "vale.com" },
  { name: "Votorantim", descKey: "trajectory.votorantim", logo: "votorantim.com.br" },
  { name: "Grupo EBX", descKey: "trajectory.ebx", logo: null },
  { name: "ETCO", descKey: "trajectory.etco", logo: "etco.org.br" },
  { name: "H&P", descKey: "trajectory.hp", logo: "hep.solutions" },
  { name: "UFMG", descKey: "trajectory.ufmg", logo: "ufmg.br" },
  { name: "C Caps", descKey: "trajectory.ccaps", logo: null },
  { name: "CeCaps", descKey: "trajectory.cecaps", logo: "cecaps.org" },
  { name: "Anglo American", descKey: "trajectory.anglo", logo: "angloamerican.com" },
  { name: "PNUD", descKey: "trajectory.pnud", logo: "undp.org" },
  { name: "Prefeitura de BH", descKey: "trajectory.prefeituraBH", logo: "pbh.gov.br" },
  { name: "IPOG", descKey: "trajectory.ipog", logo: "ipog.edu.br" },
  { name: "Maitabassa Consultoria", logo: null },
  { name: "Integratio", logo: "integratio.com.br" },
  { name: "Mineração Morro do Ipê", logo: null },
  { name: "Synergia", logo: "synergia.net.br" },
  { name: "Ledesma", logo: "ledesma.com.ar" },
  { name: "Renova Energia", logo: "renovaenergia.com.br" },
  { name: "MMX", logo: null },
  { name: "Mercantil do Brasil", logo: "mercantildobrasil.com.br" },
  { name: "Humana People to People", logo: "humana.ee" },
  { name: "Equifax", logo: "equifax.com" },
  { name: "EAF Conecta", logo: null },
  { name: "Seja:Digital", logo: "sejadigital.org.br" },
  { name: "Kroton Educacional", logo: "kroton.com.br" },
  { name: "Anhanguera Educacional", logo: "anhanguera.com" },
  { name: "SKY Brasil", logo: "sky.com.br" },
  { name: "Wunderman Brasil", logo: null },
  { name: "Exercere", logo: null },
  { name: "Proceda", logo: null },
  { name: "Banco Noroeste", logo: null },
  { name: "LVBA Comunicação", logo: null },
  { name: "Menthor", logo: null },
  { name: "Conteúdos.com", logo: null },
];

const logoUrlFor = (domain) => `https://www.google.com/s2/favicons?sz=256&domain=${domain}`;

export default function Trajectories() {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(() => new Set());

  return (
    <section id="trajetorias" className="relative py-24 lg:py-32 bg-secondary/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-10">
          <span className="text-gold text-sm font-medium tracking-[0.22em] uppercase mb-5 block">
            {t("trajectory.kicker")}
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-light text-foreground leading-[1.1] tracking-tight text-balance">
            {t("trajectory.title")}
          </h2>
          <p className="mt-5 text-foreground/70 text-[15px] leading-relaxed">
            {t("trajectory.intro")}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
          {INSTITUTIONS.map((inst) => {
            const url = inst.logo ? logoUrlFor(inst.logo) : null;
            const showLogo = url && !failed.has(inst.name);
            return (
              <div
                key={inst.name}
                className="aspect-square rounded-xl sm:rounded-2xl bg-white border border-secondary/40 flex items-center justify-center shadow-[0_4px_18px_-8px_rgba(7,48,80,0.22)] p-3 sm:p-4"
              >
                {inst.custom === "perini" ? (
                  <PeriniLogo className="w-[70%] h-[70%]" />
                ) : showLogo ? (
                  <img
                    src={url}
                    alt={inst.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                    onError={() => setFailed((prev) => new Set(prev).add(inst.name))}
                  />
                ) : (
                  <span className="font-display text-sm sm:text-sm lg:text-sm font-medium text-foreground leading-tight text-center tracking-tight px-1">
                    {inst.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}