import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "../contexts/CmsContext";

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  breadcrumbName?: string;
}

const DEFAULT_TITLE = "Кафедра візуального дизайну і мистецтва | НУ «Львівська політехніка»";
const DEFAULT_DESC = "Офіційний сайт кафедри візуального дизайну і мистецтва (ВДМ) Інституту архітектури та дизайну Національного університету «Львівська політехніка». Бакалаврат, магістратура, аспірантура, проєкти та викладацький склад.";
const DEFAULT_IMAGE = "https://vdm-dept.vercel.app/og-hero.jpg";
const BASE_URL = "https://vdm-dept.vercel.app";

function setMetaTag(selector: string, attrName: string, value: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    const [attr, val] = selector.replace(/[\[\]"]/g, "").split("=");
    element.setAttribute(attr, val);
    document.head.appendChild(element);
  }
  element.setAttribute(attrName, value);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export default function SeoHead({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  type = "website",
  breadcrumbName,
}: SeoHeadProps) {
  const location = useLocation();
  const { lang } = useCms();

  useEffect(() => {
    // 1. Synchronize HTML lang attribute
    const htmlLang = lang === "UA" ? "uk" : lang.toLowerCase();
    document.documentElement.lang = htmlLang;

    // 2. Title
    const fullTitle = title 
      ? `${title} | Кафедра візуального дизайну і мистецтва (ВДМ)` 
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // 3. Meta Description & Keywords
    const metaDesc = description || DEFAULT_DESC;
    setMetaTag('meta[name="description"]', "content", metaDesc);

    if (keywords) {
      setMetaTag('meta[name="keywords"]', "content", keywords);
    }

    // 4. Canonical & OG URL
    const canonicalUrl = `${BASE_URL}${location.pathname}`;
    setCanonical(canonicalUrl);

    // 5. Open Graph
    setMetaTag('meta[property="og:title"]', "content", fullTitle);
    setMetaTag('meta[property="og:description"]', "content", metaDesc);
    setMetaTag('meta[property="og:url"]', "content", canonicalUrl);
    setMetaTag('meta[property="og:type"]', "content", type);
    setMetaTag('meta[property="og:image"]', "content", image);

    // 6. Twitter Card
    setMetaTag('meta[name="twitter:title"]', "content", fullTitle);
    setMetaTag('meta[name="twitter:description"]', "content", metaDesc);
    setMetaTag('meta[name="twitter:image"]', "content", image);

    // 7. Inject Dynamic BreadcrumbList Schema for Google
    const breadcrumbId = "seo-dynamic-breadcrumbs";
    let scriptEl = document.getElementById(breadcrumbId) as HTMLScriptElement | null;
    if (breadcrumbName && location.pathname !== "/") {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = breadcrumbId;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Головна",
            "item": BASE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": breadcrumbName,
            "item": canonicalUrl
          }
        ]
      });
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, image, type, breadcrumbName, location.pathname, lang]);

  return null;
}
