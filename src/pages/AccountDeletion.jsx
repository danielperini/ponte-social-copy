import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/ponte/Navbar";
import Footer from "@/components/ponte/Footer";
import Seo from "@/components/ponte/Seo";
import { useToast } from "@/components/ui/use-toast";
import { site } from "@/api/siteClient";
import { useTranslation } from "@/i18n/LanguageProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AccountDeletion() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const consequences = t("accountDeletion.consequences");

  // A solicitação é analisada manualmente; este fluxo nunca apaga dados.
  const doDelete = async () => {
    setConfirmOpen(false);
    setSending(true);
    try {
      await site.requestDeletion({ email, confirmed });
      setDone(true);
      toast({ title: t("accountDeletion.toastSuccess") });
    } catch {
      toast({ title: t("accountDeletion.toastError") });
    } finally {
      setSending(false);
    }
  };

  const requestDelete = (e) => {
    e.preventDefault();
    if (!confirmed || !email) {
      toast({ title: t("accountDeletion.toastRequired") });
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <Seo title={`${t("accountDeletion.title")} | Ponte Social`} description={t("accountDeletion.intro")} />
      <Navbar />
      <main className="safe-bottom">
        <header className="pt-32 pb-10 lg:pt-40">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm tracking-[0.14em] uppercase text-foreground/70 hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft size={18} /> {t("accountDeletion.back")}
            </Link>
            <div className="flex items-center gap-3 text-sm tracking-[0.14em] uppercase text-foreground/50 mb-5">
              <ShieldAlert size={20} className="text-gold" />
              <span className="text-gold">{t("accountDeletion.kicker")}</span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-light text-foreground leading-[1.1] tracking-tight text-balance">
              {t("accountDeletion.title")}
            </h1>
            <p className="mt-5 text-foreground/70 text-lg leading-relaxed">{t("accountDeletion.intro")}</p>
          </div>
        </header>

        <section className="max-w-3xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-secondary/40 bg-secondary/15 p-6 lg:p-8">
            <h2 className="font-display text-xl text-foreground mb-4">{t("accountDeletion.consequencesTitle")}</h2>
            <ul className="space-y-3">
              {consequences.map((c, i) => (
                <li key={i} className="flex gap-3 text-foreground/80 text-[15px] leading-relaxed">
                  <span className="text-accent mt-1 shrink-0">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-6"
            >
              <CheckCircle2 size={22} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-lg text-foreground">{t("accountDeletion.doneTitle")}</p>
                <p className="text-foreground/70 text-sm mt-1 leading-relaxed">{t("accountDeletion.doneText")}</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={requestDelete} className="mt-8 space-y-5">
              <label className="block">
                <span className="block text-sm font-medium tracking-[0.14em] uppercase text-foreground/60 mb-1.5">
                  {t("accountDeletion.emailLabel")}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[44px] w-full bg-transparent border-b border-foreground/25 py-2 text-foreground placeholder:text-foreground/35 focus:border-accent outline-none"
                  placeholder="seu@email.com"
                />
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 min-h-[22px] min-w-[22px] accent-[#477A63]"
                />
                <span className="text-foreground/80 text-[15px] leading-relaxed">{t("accountDeletion.confirmText")}</span>
              </label>

              <button
                type="submit"
                disabled={sending || !confirmed || !email}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3 text-sm font-semibold tracking-[0.12em] uppercase text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : null}
                {sending ? t("accountDeletion.sending") : t("accountDeletion.submit")}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-foreground/55 leading-relaxed">{t("accountDeletion.note")}</p>
        </section>
      </main>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("accountDeletion.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("accountDeletion.confirmBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">{t("accountDeletion.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDelete}
              className="min-h-[44px] bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("accountDeletion.submit")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}