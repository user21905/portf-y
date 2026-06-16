import { homeContentRepository } from "../repositories/home-content.repository.js";
import { aboutContentRepository } from "../repositories/about-content.repository.js";
import { siteSettingRepository } from "../repositories/site-setting.repository.js";
import { pageContentRepository } from "../repositories/page-content.repository.js";
import { educationRepository } from "../repositories/education.repository.js";
import { skillRepository } from "../repositories/skill.repository.js";
import { projectRepository } from "../repositories/project.repository.js";
import { contactMessageRepository } from "../repositories/contact-message.repository.js";
import { SKILL_CATEGORIES } from "../config/constants.js";
import { ClientValidationError } from "../errors/client-validation.error.js";
import { isValidSlug, slugifyTitle } from "../lib/slugify.js";

function requireAltWhenImageUrl(imageUrl: string | null | undefined, imageAlt: string | null | undefined) {
  const url = imageUrl?.trim();
  const alt = imageAlt?.trim();
  if (url && !alt) {
    throw new ClientValidationError("Görsel URL girildiğinde alt metin zorunludur.");
  }
}

function requireOgAltWhenOgImage(ogImageUrl: string | null | undefined, ogImageAlt: string | null | undefined) {
  const url = ogImageUrl?.trim();
  const alt = ogImageAlt?.trim();
  if (url && !alt) {
    throw new ClientValidationError("Open Graph görseli için alt metin zorunludur.");
  }
}

async function resolveUniqueSlug(base: string, excludeProjectId?: string): Promise<string> {
  let suffix = 0;
  while (suffix < 500) {
    const candidate = suffix === 0 ? base : `${base}-${suffix}`;
    const existing = await projectRepository.findBySlug(candidate);
    if (!existing || existing.id === excludeProjectId) return candidate;
    suffix += 1;
  }
  throw new ClientValidationError("Benzersiz slug üretilemedi.");
}

export const contentService = {
  async getPublicContent() {
    const [home, about, settings, pageContent, education, skills, projects] = await Promise.all([
      homeContentRepository.findFirst(),
      aboutContentRepository.findFirst(),
      siteSettingRepository.findFirst(),
      pageContentRepository.findFirst(),
      educationRepository.findFirst(),
      skillRepository.findAll(),
      projectRepository.findAll(),
    ]);
    return {
      home: home ?? null,
      about: about ?? null,
      settings: settings ?? null,
      pageContent: pageContent ?? null,
      education: education ?? null,
      skills,
      projects,
    };
  },

  async getHome() {
    return homeContentRepository.findFirst();
  },
  async updateHome(data: {
    fullName: string;
    headline?: string;
    introText: string;
    ctaButtonText?: string;
  }) {
    return homeContentRepository.upsert(data);
  },

  async getAbout() {
    return aboutContentRepository.findFirst();
  },
  async updateAbout(body: string) {
    return aboutContentRepository.upsert(body);
  },

  async getSettings() {
    return siteSettingRepository.findFirst();
  },
  async updateSettings(data: {
    siteTitle?: string;
    siteDesc?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    metaKeywords?: string | null;
    ogImageUrl?: string | null;
    ogImageAlt?: string | null;
    twitterCreator?: string | null;
    canonicalBaseUrl?: string | null;
  }) {
    requireOgAltWhenOgImage(data.ogImageUrl ?? undefined, data.ogImageAlt ?? undefined);
    return siteSettingRepository.upsert(data);
  },

  async getPageContent() {
    return pageContentRepository.findFirst();
  },
  async updatePageContent(data: {
    heroBadge?: string;
    aboutSecondaryCtaLabel?: string;
    nowEyebrow?: string;
    nowTitle?: string;
    nowSubtitle?: string;
    nowCards?: { title: string; description: string }[];
    spotlightProjectSlug?: string | null;
    spotlightEyebrow?: string;
    spotlightTitle?: string;
    featuredEyebrow?: string;
    featuredTitle?: string;
    featuredSubtitle?: string;
    partnershipsTitle?: string;
    partnershipsBody?: string;
    contactEmail?: string;
    contactLocation?: string;
    contactReplyTime?: string;
    contactDirectTitle?: string;
    contactDirectIntro?: string;
    contactPageIntro?: string;
  }) {
    return pageContentRepository.upsert(data);
  },

  async getEducation() {
    return educationRepository.findFirst();
  },
  async updateEducation(data: { university: string; department: string; courses: string }) {
    return educationRepository.upsert(data);
  },

  async getSkills() {
    return skillRepository.findAll();
  },
  async createSkill(data: { name: string; category: string; orderNum?: number }) {
    if (!SKILL_CATEGORIES.includes(data.category as never)) {
      throw new Error("Invalid skill category");
    }
    return skillRepository.create(data);
  },
  async updateSkill(
    id: string,
    data: { name?: string; category?: string; orderNum?: number }
  ) {
    if (data.category && !SKILL_CATEGORIES.includes(data.category as never)) {
      throw new Error("Invalid skill category");
    }
    return skillRepository.update(id, data);
  },
  async deleteSkill(id: string) {
    return skillRepository.delete(id);
  },

  async getProjects() {
    return projectRepository.findAll();
  },

  async getProjectBySlug(slug: string) {
    return projectRepository.findBySlug(slug.trim());
  },

  async createProject(data: {
    title: string;
    description: string;
    techStack: string;
    slug?: string | null;
    technologies?: string | null;
    challenge?: string | null;
    solution?: string | null;
    isFeatured?: boolean;
    githubUrl?: string | null;
    demoUrl?: string | null;
    imageUrl?: string | null;
    imageAlt?: string | null;
    orderNum?: number;
    caseStudyContent?: string | null;
  }) {
    requireAltWhenImageUrl(data.imageUrl, data.imageAlt);
    const requested = data.slug?.trim();
    if (requested && !isValidSlug(requested)) {
      throw new ClientValidationError("Slug yalnızca küçük harf, rakam ve tire içerebilir.");
    }
    const base = requested && isValidSlug(requested) ? requested : slugifyTitle(data.title);
    const slug = await resolveUniqueSlug(base);
    return projectRepository.create({
      slug,
      title: data.title,
      description: data.description,
      techStack: data.techStack,
      technologies: data.technologies?.trim() || null,
      challenge: data.challenge?.trim() ?? "",
      solution: data.solution?.trim() ?? "",
      isFeatured: Boolean(data.isFeatured),
      githubUrl: data.githubUrl ?? null,
      demoUrl: data.demoUrl ?? null,
      imageUrl: data.imageUrl ?? null,
      imageAlt: data.imageAlt ?? null,
      orderNum: data.orderNum,
      caseStudyContent: data.caseStudyContent?.trim() || undefined,
    });
  },
  async updateProject(
    id: string,
    data: {
      slug?: string | null;
      title?: string;
      description?: string;
      techStack?: string;
      technologies?: string | null;
      challenge?: string | null;
      solution?: string | null;
      isFeatured?: boolean;
      githubUrl?: string | null;
      demoUrl?: string | null;
      imageUrl?: string | null;
      imageAlt?: string | null;
      orderNum?: number;
      caseStudyContent?: string | null;
    }
  ) {
    requireAltWhenImageUrl(data.imageUrl, data.imageAlt);
    type ProjectPatch = Parameters<typeof projectRepository.update>[1];
    const next: ProjectPatch = {};
    if (data.title !== undefined) next.title = data.title;
    if (data.description !== undefined) next.description = data.description;
    if (data.techStack !== undefined) next.techStack = data.techStack;
    if (data.githubUrl !== undefined) next.githubUrl = data.githubUrl;
    if (data.demoUrl !== undefined) next.demoUrl = data.demoUrl;
    if (data.imageUrl !== undefined) next.imageUrl = data.imageUrl;
    if (data.imageAlt !== undefined) next.imageAlt = data.imageAlt;
    if (data.orderNum !== undefined) next.orderNum = data.orderNum;
    if (data.slug !== undefined) {
      const s = data.slug?.trim() ?? "";
      if (s) {
        if (!isValidSlug(s)) {
          throw new ClientValidationError("Slug yalnızca küçük harf, rakam ve tire içerebilir.");
        }
        next.slug = await resolveUniqueSlug(s, id);
      }
    }
    if (data.technologies !== undefined) {
      next.technologies = data.technologies?.trim() || null;
    }
    if (data.challenge !== undefined) next.challenge = data.challenge?.trim() ?? "";
    if (data.solution !== undefined) next.solution = data.solution?.trim() ?? "";
    if (data.isFeatured !== undefined) next.isFeatured = Boolean(data.isFeatured);
    if (data.caseStudyContent !== undefined) {
      next.caseStudyContent = data.caseStudyContent?.trim() || undefined;
    }
    return projectRepository.update(id, next);
  },
  async deleteProject(id: string) {
    return projectRepository.delete(id);
  },

  async getMessages() {
    return contactMessageRepository.findAll();
  },
  async createMessage(data: { name: string; email: string; subject?: string; message: string }) {
    return contactMessageRepository.create(data);
  },
  async markMessageRead(id: string) {
    return contactMessageRepository.markAsRead(id);
  },
};
