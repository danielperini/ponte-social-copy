import React from "react";
import { Mail, Linkedin, MapPin, Lock, FileText, MessageCircle } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";
export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-[#FFFFFF]/70 safe-bottom">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-16 pb-10 flex flex-col items-center text-center">
        {/* Contato */}
        <h4 className="text-[11px] font-body font-semibold tracking-[0.22em] uppercase text-[#A8B7A0] mb-5">
          {t("footer.contactTitle")}
        </h4>
        <div className="space-y-1.5">
          <p className="flex items-start justify-center gap-3 text-sm text-[#FFFFFF]/75 leading-snug max-w-xl">
            <MapPin size={15} className="text-[#A8B7A0] shrink-0 mt-0.5" />
            {t("footer.address")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm">
            <a href={`mailto:${t("footer.email")}`} className="flex items-center gap-2 text-[#FFFFFF]/75 hover:text-[#FFFFFF] transition-colors min-h-[36px]">
              <Mail size={15} className="text-[#A8B7A0] shrink-0" />
              {t("footer.email")}
            </a>
            <span className="text-[#FFFFFF]/25 select-none" aria-hidden>·</span>
            <a href={t("footer.whatsappHref")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#FFFFFF]/75 hover:text-[#FFFFFF] transition-colors min-h-[36px]">
              <MessageCircle size={15} className="text-[#A8B7A0] shrink-0" />
              {t("footer.whatsapp")}
            </a>
          </div>
        </div>

        {/* Redes */}
        <div className="mt-7 flex flex-col items-center">
          <h4 className="text-[11px] font-body font-semibold tracking-[0.22em] uppercase text-[#A8B7A0] mb-2">
            {t("footer.followTitle")}
          </h4>
          <a
            href="https://www.linkedin.com/company/pontesocialconsultoria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#FFFFFF]/75 hover:text-[#FFFFFF] transition-colors min-h-[36px]"
          >
            <Linkedin size={15} className="text-[#A8B7A0]" />
            {t("footer.linkedinLabel")}
          </a>
        </div>

        {/* Privacidade e ética */}
        <div className="mt-9 flex flex-col items-center">
          <h4 className="text-[11px] font-body font-semibold tracking-[0.22em] uppercase text-[#A8B7A0] mb-3">
            {t("footer.legalTitle")}
          </h4>
          <div className="space-y-1.5 text-xs text-[#FFFFFF]/50 leading-relaxed max-w-lg">
            <p className="flex items-start justify-center gap-2">
              <Lock size={13} className="text-[#A8B7A0] shrink-0 mt-0.5" />
              <span>{t("footer.privacy")}</span>
            </p>
            <p className="flex items-start justify-center gap-2">
              <FileText size={13} className="text-[#A8B7A0] shrink-0 mt-0.5" />
              <span>{t("footer.cookieNote")}</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-[#FFFFFF]/35 tracking-wide">
          © {year} Ponte Social Consultoria. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}