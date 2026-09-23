import React, { useEffect } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";
import { LANGUAGES } from "@/i18n/translations";

const MAIN_DOMAIN = "https://www.pontesocialconsultoria.com.br";
const OG_LOCALE = { "pt-BR": "pt_BR", en: "en_US", es: "es_419" };
const DEFAULT_OG_IMAGE = "https://media.base44.com/images/public/6aa331bf5cf4993602fef0a7/5410ea027_WhatsAppImage2026-09-11at092845.jpeg";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, hreflang, href) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function Seo({ title, description, keywords, image }) {
  const { lang } = useTranslation();
  const ogImage = image || DEFAULT_OG_IMAGE;
  const canonicalPath = window.location.pathname || "/";
  const canonical = `${MAIN_DOMAIN}${canonicalPath}`;

  useEffect(() => {
    document.title = title || "";

    upsertMeta("name", "description", description);
    if (keywords) upsertMeta("name", "keywords", keywords);
    upsertMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    upsertMeta("name", "googlebot", "index, follow");

    upsertMeta("property", "og:site_name", "Ponte Social Consultoria");
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:locale", OG_LOCALE[lang]);
    upsertMeta("property", "og:locale:alternate", "en_US");
    upsertMeta("property", "og:locale:alternate", "es_419");
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:secure_url", ogImage);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", "Ponte Social Consultoria");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);
    upsertMeta("name", "twitter:image:alt", "Ponte Social Consultoria");

    upsertLink("canonical", null, canonical);
    LANGUAGES.forEach((l) => upsertLink("alternate", l, `${canonical}?lang=${l}`));
    upsertLink("alternate", "x-default", `${canonical}?lang=pt-BR`);

    upsertJsonLd("ld-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": canonical }
      ]
    });
  }, [lang, title, description, keywords, image, canonical, ogImage]);

  return null;
}