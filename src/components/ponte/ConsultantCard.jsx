import React, { useState } from "react";
import { Linkedin, ChevronDown, GraduationCap, Award, BookOpen, CheckCircle2, Sparkles } from "lucide-react";

export default function ConsultantCard({ p, labels }) {
  const [showFull, setShowFull] = useState(false);
  const hasExpand = (p.certs?.length > 0 || p.complementary?.length > 0 || p.competencies?.length > 0);

  return (
    <div className="h-full min-h-[560px] lg:min-h-[640px] flex flex-col bg-secondary/10 border border-secondary/30 rounded-xl p-5 lg:p-6 shadow-[0_1px_3px_rgba(7,48,80,0.04)]">
      <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">{p.kicker}</span>
      <h3 className="font-display text-xl lg:text-2xl text-foreground mt-1.5 leading-tight">{p.name}</h3>
      <p className="text-accent text-sm font-medium mt-1 leading-snug">{p.role}</p>
      <div className="mt-3 text-foreground/75 text-sm leading-relaxed space-y-2">
        {p.summary?.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {p.pontePitch && (
        <p className="mt-3 text-foreground text-sm italic leading-relaxed border-l-2 border-accent pl-3">
          {p.pontePitch}
        </p>
      )}

      {p.education?.length > 0 && (
        <div className="mt-4 border-t border-foreground/12 pt-3">
          <p className="flex items-center gap-2 text-sm font-medium tracking-[0.18em] uppercase text-foreground/50 mb-1.5">
            <GraduationCap size={14} className="text-accent" />
            {labels.educationTitle}
          </p>
          <ul className="space-y-1">
            {p.education.map((e, i) => (
              <li key={i} className="text-foreground/75 text-sm leading-relaxed flex gap-2">
                <span className="text-accent">·</span>{e}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 border-t border-foreground/12 pt-3 flex-1 flex flex-col min-h-0">
        {p.certsShort && (
          <>
            <p className="flex items-center gap-2 text-sm font-medium tracking-[0.18em] uppercase text-foreground/50 mb-1.5">
              <Award size={14} className="text-accent" />
              {labels.certsTitle}
            </p>
            <p className="text-foreground text-sm font-medium leading-relaxed">{p.certsShort}</p>
          </>
        )}
        {hasExpand && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-accent hover:underline self-start select-none [-webkit-user-select:none]"
          >
            {showFull ? labels.hideFull : labels.seeFull}
            <ChevronDown size={14} className={`transition-transform ${showFull ? "rotate-180" : ""}`} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto mt-2 -mx-1 px-1 [overscroll-behavior-y:contain]">
          {showFull && (
            <>
              {p.certs?.length > 0 && (
                <ul className="space-y-2">
                  {p.certs.map((c, i) => (
                    <li key={i} className="text-foreground/75 text-sm leading-relaxed flex gap-2">
                      {c.ongoing ? (
                        <span className="text-accent text-sm font-medium uppercase tracking-wide mt-0.5 shrink-0">{labels.ongoing}</span>
                      ) : (
                        <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                      )}
                      <span>
                        <span className="text-foreground">{c.name}</span> — {c.inst}
                        {c.year ? ` · ${c.year}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {p.complementary?.length > 0 && (
                <>
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium tracking-[0.18em] uppercase text-foreground/50 mb-1.5">
                    <BookOpen size={14} className="text-accent" />
                    {labels.complementaryTitle}
                  </p>
                  <ul className="space-y-1">
                    {p.complementary.map((c, i) => (
                      <li key={i} className="text-foreground/70 text-sm leading-relaxed flex gap-2">
                        <span className="text-accent">·</span>{c}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {p.competencies?.length > 0 && (
                <>
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium tracking-[0.18em] uppercase text-foreground/50 mb-1.5">
                    <Sparkles size={14} className="text-accent" />
                    {labels.competenciesTitle}
                  </p>
                  <ul className="space-y-2">
                    {p.competencies.map((c, i) => (
                      <li key={i}>
                        <span className="text-foreground text-sm font-medium">{c.title}</span>
                        <p className="text-foreground/70 text-sm leading-relaxed">{c.text}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {p.specialties?.length > 0 && (
        <div className="mt-4 border-t border-foreground/12 pt-3">
          <p className="flex items-center gap-2 text-sm font-medium tracking-[0.18em] uppercase text-foreground/50 mb-1.5">
            <Sparkles size={14} className="text-accent" />
            {labels.specialtiesTitle}
          </p>
          <ul className="space-y-1">
            {p.specialties.map((s, i) => (
              <li key={i} className="text-foreground/75 text-sm leading-relaxed flex gap-2">
                <span className="text-accent">·</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={p.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm text-foreground hover:text-accent transition-colors border-t border-foreground/12 pt-3"
      >
        <Linkedin size={16} className="text-accent" />
        {labels.linkedinCta}
      </a>
      <p className="mt-2 text-sm text-foreground/45 leading-relaxed">{labels.profileNote}</p>
    </div>
  );
}