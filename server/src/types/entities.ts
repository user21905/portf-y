/**
 * Firestore koleksiyonlarındaki dokümanların dış dünyaya açılan tipleri.
 * Tüm tarih alanları client ile tutarlılık için ISO 8601 string olarak döner.
 */

export interface Admin {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  siteTitle: string;
  siteDesc: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  metaKeywords: string | null;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  twitterCreator: string | null;
  canonicalBaseUrl: string | null;
  updatedAt: string;
}

export interface HomeContent {
  id: string;
  fullName: string;
  headline: string;
  introText: string;
  ctaButtonText: string;
  updatedAt: string;
}

export interface AboutContent {
  id: string;
  body: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  orderNum: number;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  techStack: string;
  technologies: string | null;
  challenge: string;
  solution: string;
  isFeatured: boolean;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  orderNum: number;
  createdAt: string;
  updatedAt: string;
  caseStudyContent?: string;
}

export interface Education {
  id: string;
  university: string;
  department: string;
  courses: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/** Ana sayfa dinamik bölümleri (Now, spotlight, CTA vb.) */
export interface NowCard {
  title: string;
  description: string;
}

export interface PageContent {
  id: string;
  heroBadge: string;
  aboutSecondaryCtaLabel: string;
  nowEyebrow: string;
  nowTitle: string;
  nowSubtitle: string;
  nowCards: NowCard[];
  spotlightProjectSlug: string | null;
  spotlightEyebrow: string;
  spotlightTitle: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredSubtitle: string;
  partnershipsTitle: string;
  partnershipsBody: string;
  contactEmail: string;
  contactLocation: string;
  contactReplyTime: string;
  contactDirectTitle: string;
  contactDirectIntro: string;
  contactPageIntro: string;
  updatedAt: string;
}

/**
 * Firestore'da tekil (singleton) saklanan koleksiyonlar için sabit doc id'ler.
 * Böylece her zaman aynı dokümanı okuyup yazabiliriz ve "ilk satırı bul" mantığı
 * yerine belirleyici bir okuma yapabiliriz.
 */
export const SINGLETON_DOC_ID = "default";

export const COLLECTIONS = {
  admins: "admins",
  siteSettings: "siteSettings",
  homeContent: "homeContent",
  aboutContent: "aboutContent",
  skills: "skills",
  projects: "projects",
  education: "education",
  contactMessages: "contactMessages",
  pageContent: "pageContent",
} as const;
