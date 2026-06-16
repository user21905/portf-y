import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getPageSeo } from "@/config/page-seo";
import { ROUTES } from "@/config/constants";
import type { SiteSetting } from "@/types/content";
import type { HomeContent } from "@/types/content";

const DEFAULT_DESCRIPTION =
  "Yazılım mühendisliği öğrencisi portföyü — projeler, yetkinlikler ve iletişim.";

function resolveAbsoluteUrl(base: string, url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const origin = base.replace(/\/$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${origin}${path}`;
}

function mergeKeywords(pageKeywords: string | undefined, globalKeywords: string | null | undefined): string | undefined {
  const parts = [pageKeywords, globalKeywords].map((k) => k?.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.join(", ");
}

interface SiteHeadProps {
  settings: SiteSetting | null;
  home: HomeContent | null;
}

export function SiteHead({ settings, home }: SiteHeadProps) {
  const { pathname } = useLocation();
  const page = getPageSeo(pathname);
  const siteTitle = settings?.siteTitle?.trim() || "Portföy";
  const siteDesc = settings?.siteDesc?.trim() || null;
  const intro = home?.introText?.trim() || null;

  const description =
    pathname === ROUTES.HOME && intro
      ? intro.slice(0, 160)
      : page.description.trim() || siteDesc || DEFAULT_DESCRIPTION;

  const fullName = home?.fullName?.trim();
  const title =
    pathname === ROUTES.HOME
      ? fullName
        ? `${fullName} | ${siteTitle}`
        : siteTitle
      : `${page.segmentTitle} | ${siteTitle}`;

  const browserOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const configuredOrigin = settings?.canonicalBaseUrl?.trim().replace(/\/$/, "") ?? "";
  const origin = configuredOrigin || browserOrigin;

  const canonicalBase = origin.replace(/\/$/, "");
  const canonical =
    canonicalBase === ""
      ? undefined
      : `${canonicalBase}${pathname === "/" ? "/" : pathname}`;
  const keywords = mergeKeywords(page.keywords, settings?.metaKeywords);

  const ogImage = resolveAbsoluteUrl(origin, settings?.ogImageUrl);
  const ogImageAlt = settings?.ogImageAlt?.trim() || siteTitle;
  const twitterHandle = settings?.twitterCreator?.trim().replace(/^@/, "");

  return (
    <Helmet prioritizeSeoTags>
      <html lang="tr" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content="tr_TR" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={ogImageAlt} />}

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {ogImage && <meta name="twitter:image:alt" content={ogImageAlt} />}
      {twitterHandle && <meta name="twitter:creator" content={`@${twitterHandle}`} />}
    </Helmet>
  );
}
