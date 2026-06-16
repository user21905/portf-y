import { api } from "./client";
import type { PublicContent, Project } from "@/types/content";

export const contentApi = {
  getPublic: () => api.get<PublicContent>("/content", { silent: true }),
  getProjectBySlug: (slug: string) =>
    api.get<Project>(`/projects/${encodeURIComponent(slug)}`, { silent: true }),
};
