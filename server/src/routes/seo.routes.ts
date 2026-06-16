import type { Request, Response } from "express";
import { siteSettingRepository } from "../repositories/site-setting.repository.js";
import { env } from "../config/env.js";
import { INDEXABLE_PUBLIC_PATHS } from "../config/public-paths.js";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function resolveSiteOrigin(req: Request): Promise<string> {
  if (env.publicSiteUrl) return env.publicSiteUrl;
  const settings = await siteSettingRepository.findFirst();
  if (settings?.canonicalBaseUrl?.trim()) {
    return settings.canonicalBaseUrl.trim().replace(/\/$/, "");
  }
  const forwardedProto = req.get("x-forwarded-proto");
  const forwardedHost = req.get("x-forwarded-host");
  const host = forwardedHost || req.get("host") || "localhost:5173";
  const protocol = forwardedProto || req.protocol || "http";
  return `${protocol}://${host}`;
}

export async function serveSitemap(req: Request, res: Response): Promise<void> {
  try {
    const origin = await resolveSiteOrigin(req);
    const lastmod = new Date().toISOString().split("T")[0];
    const base = origin.replace(/\/$/, "");
    const urls = INDEXABLE_PUBLIC_PATHS.map((entry) => {
      const loc = entry.path === "/" ? `${base}/` : `${base}${entry.path}`;
      return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(xml.trim());
  } catch (e) {
    console.error(e);
    res.status(500).send("Sitemap oluşturulamadı");
  }
}

export async function serveRobots(req: Request, res: Response): Promise<void> {
  try {
    const origin = await resolveSiteOrigin(req);
    const lines = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "",
      `Sitemap: ${origin}/sitemap.xml`,
      "",
    ];
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(lines.join("\n"));
  } catch (e) {
    console.error(e);
    res.status(500).send("robots.txt oluşturulamadı");
  }
}
