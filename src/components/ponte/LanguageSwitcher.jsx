import React from "react";
import { useTranslation } from "@/i18n/LanguageProvider";

const OPTIONS = [
  { code: "pt-BR", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
];

export default function LanguageSwitcher({ scrolled = true, className = "" }) {
  const { lang, setLang, t } = useTranslation();
  const inactiveColor = "text-[#FFFFFF]";
  const dividerColor = "text-[#A4B29B]";

  return (
    <nav
      aria-label={t("langSelector.ariaLabel")}
      className={`flex items-center gap-1 select-none [-webkit-user-select:none] ${className}`}
    >
      {OPTIONS.map((o, i) => {
        const active = lang === o.code;
        return [
          i > 0 && (
            <span key={`sep-${o.code}`} className={`${dividerColor} text-sm select-none`}>
              ·
            </span>
          ),
          <button
            key={o.code}
            type="button"
            lang={o.code}
            aria-current={active ? "true" : undefined}
            aria-label={o.name}
            onClick={() => setLang(o.code)}
            className={`text-sm font-medium tracking-[0.08em] px-1.5 min-h-[44px] min-w-[44px] flex items-center transition-all active:scale-95 ${
              active ? "text-[#477A63] font-semibold" : `${inactiveColor} hover:text-[#A4B29B]`
            }`}
          >
            {o.label}
          </button>,
        ];
      })}
    </nav>
  );
}