import { ROUTES } from "@/config/constants";

export interface PageSeoDefinition {
  segmentTitle: string;
  description: string;
  keywords?: string;
}

export const PAGE_SEO: Record<string, PageSeoDefinition> = {
  [ROUTES.HOME]: {
    segmentTitle: "Ana Sayfa",
    description: "",
    keywords: "yazılım mühendisliği, portföy, öğrenci projeleri",
  },
  [ROUTES.ABOUT]: {
    segmentTitle: "Hakkımda",
    description: "Eğitim, yazılıma bakış ve öğrenme odaklı kısa özgeçmiş.",
    keywords: "hakkımda, yazılım mühendisliği öğrencisi",
  },
  [ROUTES.SKILLS]: {
    segmentTitle: "Yetkinlikler",
    description: "Programlama dilleri, web teknolojileri ve yazılım kavramları.",
    keywords: "yetkinlikler, programlama, web geliştirme",
  },
  [ROUTES.PROJECTS]: {
    segmentTitle: "Projeler",
    description: "Geliştirilen projeler, kullanılan teknolojiler ve bağlantılar.",
    keywords: "projeler, github, demo, yazılım projeleri",
  },
  [ROUTES.EDUCATION]: {
    segmentTitle: "Eğitim",
    description: "Üniversite, bölüm ve alınan dersler.",
    keywords: "eğitim, üniversite, müfredat",
  },
  [ROUTES.CONTACT]: {
    segmentTitle: "İletişim",
    description: "İletişim formu ve bağlantı bilgileri.",
    keywords: "iletişim, mesaj",
  },
};

export function getPageSeo(pathname: string): PageSeoDefinition {
  if (pathname.startsWith(`${ROUTES.PROJECTS}/`) && pathname.length > ROUTES.PROJECTS.length + 1) {
    return {
      segmentTitle: "Proje",
      description: "Proje detayı, zorluklar ve çözüm yaklaşımı.",
      keywords: "proje, case study, yazılım",
    };
  }
  return PAGE_SEO[pathname] ?? PAGE_SEO[ROUTES.HOME];
}
