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
}

export interface HomeContent {
  id: string;
  fullName: string;
  headline: string;
  introText: string;
  ctaButtonText: string;
}

export interface AboutContent {
  id: string;
  body: string;
}

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
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  orderNum: number;
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
  caseStudyContent?: string | null;
}

export interface Education {
  id: string;
  university: string;
  department: string;
  courses: string;
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

export interface PublicContent {
  home: HomeContent | null;
  about: AboutContent | null;
  settings: SiteSetting | null;
  pageContent: PageContent | null;
  education: Education | null;
  skills: Skill[];
  projects: Project[];
}

/** Admin ayarlar sekmesi için birleşik form tipi */
export interface AdminSettingsBundle {
  settings: SiteSetting | null;
  about: AboutContent | null;
  education: Education | null;
  pageContent: PageContent | null;
}
