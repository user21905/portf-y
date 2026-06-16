import type { Project } from "@/types/content";

export function getProjectTechBadgeList(project: Project): string[] {
  const fromTechnologies = project.technologies?.trim();
  const source = fromTechnologies ? fromTechnologies : project.techStack;
  return source
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
