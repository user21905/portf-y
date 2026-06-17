export const ROUTES = {
  HOME: "/",
  ABOUT: "/hakkimda",
  SKILLS: "/yetkinlikler",
  PROJECTS: "/projeler",
  EDUCATION: "/egitim",
  CONTACT: "/iletisim",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/giris",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PROJECTS: "/admin/projects",
  ADMIN_ABOUT: "/admin/about",
  ADMIN_EDUCATION: "/admin/education",
  ADMIN_NOW: "/admin/now",
  ADMIN_CONTACT: "/admin/contact",
  ADMIN_MESSAGES: "/admin/mesajlar",
} as const;

export function projectDetailPath(slug: string): string {
  return `${ROUTES.PROJECTS}/${encodeURIComponent(slug)}`;
}

/** Site logosu / marka adı (navbar, footer, CV vb.) */
export const SITE_BRAND_NAME = "Çelebi";

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  core: "Core & Languages",
  frontend: "Frontend Architecture",
  backend: "Backend & Ecosystem",
  protocols: "Protocols & R&D",
  language: "Core & Languages",
  web: "Backend & Ecosystem",
  concept: "Yazılım Kavramı",
};

export const SKILL_CATEGORY_OPTIONS = [
  { value: "core", label: "Core & Languages" },
  { value: "frontend", label: "Frontend Architecture" },
  { value: "backend", label: "Backend & Ecosystem" },
  { value: "protocols", label: "Protocols & R&D" },
] as const;

export const SKILL_CATEGORY_ORDER = [
  "core",
  "frontend",
  "backend",
  "protocols",
  "language",
  "web",
  "concept",
] as const;

export const SKILL_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  core: "Strictly-typed, sürdürülebilir kod tabanları; tip güvenliği ve okunabilirliği tüm stack boyunca koruyorum.",
  frontend:
    "Bileşen odaklı mimari, durum yönetimi ve premium arayüz sistemleri; performans ile kullanıcı deneyimini birlikte optimize ediyorum.",
  backend:
    "RESTful servisler, ORM katmanı ve ilişkisel veritabanı tasarımı; production-ready, test edilebilir API'ler geliştiriyorum.",
  protocols:
    "WebRTC, UDP keşif ve P2P ağ tasarımı; düşük gecikmeli veri kanalları ve offline-first senaryolar üzerinde çalışıyorum.",
  language:
    "Strictly-typed, sürdürülebilir kod tabanları; tip güvenliği ve okunabilirliği tüm stack boyunca koruyorum.",
  web: "RESTful servisler, ORM katmanı ve ilişkisel veritabanı tasarımı; production-ready API'ler geliştiriyorum.",
  concept: "Yazılım mühendisliği prensipleri ve mimari karar alma süreçleri.",
};
