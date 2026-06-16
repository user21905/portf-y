import { api } from "./client";
import type {
  HomeContent,
  AboutContent,
  SiteSetting,
  PageContent,
  Education,
  Skill,
  Project,
  ContactMessage,
  PublicContent,
  AdminSettingsBundle,
} from "@/types/content";

export interface DashboardStats {
  projectCount: number;
  messageCount: number;
  unreadCount: number;
  recentProjects: Project[];
  recentMessages: ContactMessage[];
}

export const adminApi = {
  getDashboard: () => api.get<DashboardStats>("/admin/dashboard"),
  getContent: () => api.get<PublicContent>("/admin/content"),

  getHome: () => api.get<HomeContent | null>("/admin/home"),
  updateHome: (data: Partial<HomeContent> & { fullName: string; introText: string }) =>
    api.put<HomeContent>("/admin/home", data),

  getAbout: () => api.get<AboutContent | null>("/admin/about"),
  updateAbout: (body: string) => api.put<AboutContent>("/admin/about", { body }),

  getSettings: () => api.get<SiteSetting | null>("/admin/settings"),
  updateSettings: (data: Partial<SiteSetting>) =>
    api.put<SiteSetting>("/admin/settings", data),

  getPageContent: () => api.get<PageContent | null>("/admin/page-content"),
  updatePageContent: (data: Partial<Omit<PageContent, "id">>) =>
    api.put<PageContent>("/admin/page-content", data),

  getSettingsBundle: async (): Promise<AdminSettingsBundle> => {
    const [settings, about, education, pageContent] = await Promise.all([
      api.get<SiteSetting | null>("/admin/settings"),
      api.get<AboutContent | null>("/admin/about"),
      api.get<Education | null>("/admin/education"),
      api.get<PageContent | null>("/admin/page-content"),
    ]);
    return { settings, about, education, pageContent };
  },

  saveSettingsBundle: async (data: {
    settings: Partial<SiteSetting>;
    aboutBody: string;
    education: { university: string; department: string; courses: string };
    pageContent: Partial<Omit<PageContent, "id">>;
  }) => {
    const [settings, about, education, pageContent] = await Promise.all([
      api.put<SiteSetting>("/admin/settings", data.settings),
      api.put<AboutContent>("/admin/about", { body: data.aboutBody }),
      api.put<Education>("/admin/education", data.education),
      api.put<PageContent>("/admin/page-content", data.pageContent),
    ]);
    return { settings, about, education, pageContent };
  },

  getEducation: () => api.get<Education | null>("/admin/education"),
  updateEducation: (data: { university: string; department: string; courses: string }) =>
    api.put<Education>("/admin/education", data),

  getSkills: () => api.get<Skill[]>("/admin/skills"),
  createSkill: (data: { name: string; category: string; orderNum?: number }) =>
    api.post<Skill>("/admin/skills", data),
  updateSkill: (id: string, data: Partial<Skill>) =>
    api.put<Skill>(`/admin/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/admin/skills/${id}`),

  getProjects: () => api.get<Project[]>("/admin/projects"),
  createProject: (data: {
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
  }) => api.post<Project>("/admin/projects", data),
  updateProject: (
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
  ) => api.put<Project>(`/admin/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),

  getMessages: () => api.get<ContactMessage[]>("/admin/messages"),
  markMessageRead: (id: string) =>
    api.patch<{ success: boolean }>(`/admin/messages/${id}/read`),
};
