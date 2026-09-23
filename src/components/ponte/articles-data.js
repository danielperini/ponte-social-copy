import a1 from "./articles/a1";
import a2 from "./articles/a2";
import a3 from "./articles/a3";
import a4 from "./articles/a4";
import a5 from "./articles/a5";
import a6 from "./articles/a6";
import a7 from "./articles/a7";
import a8 from "./articles/a8";
import a9 from "./articles/a9";
import a10 from "./articles/a10";
import a11 from "./articles/a11";
import a12 from "./articles/a12";
import { useTranslation } from "@/i18n/LanguageProvider";

export const ARTICLES_RAW = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12];

export function localizeArticle(article, lang) {
  const tr = article.translations[lang] || article.translations["pt-BR"];
  return {
    slug: article.slug,
    image: article.image,
    author: article.author,
    category: tr.category,
    title: tr.title,
    date: tr.date,
    excerpt: tr.excerpt,
    description: tr.description || tr.excerpt,
    keywords: tr.keywords || [],
    metaTitle: tr.metaTitle || `${tr.title} | Ponte Social`,
    metaDescription: tr.metaDescription || tr.description || tr.excerpt,
    imageAlt: tr.imageAlt || tr.title,
    body: tr.body,
  };
}

export function useArticles() {
  const { lang } = useTranslation();
  return ARTICLES_RAW.map((a) => localizeArticle(a, lang));
}

export function useArticle(slug) {
  const { lang } = useTranslation();
  const raw = ARTICLES_RAW.find((a) => a.slug === slug);
  return raw ? localizeArticle(raw, lang) : null;
}

export function useOtherArticles(slug) {
  const { lang } = useTranslation();
  return ARTICLES_RAW.filter((a) => a.slug !== slug).map((a) => localizeArticle(a, lang));
}