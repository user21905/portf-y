export interface SitemapPathEntry {
  path: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
}

export const INDEXABLE_PUBLIC_PATHS: SitemapPathEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/hakkimda", changefreq: "monthly", priority: "0.8" },
  { path: "/yetkinlikler", changefreq: "monthly", priority: "0.8" },
  { path: "/projeler", changefreq: "weekly", priority: "0.9" },
  { path: "/egitim", changefreq: "monthly", priority: "0.7" },
  { path: "/iletisim", changefreq: "monthly", priority: "0.7" },
];
