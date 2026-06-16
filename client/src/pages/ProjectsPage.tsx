import { Link } from "react-router-dom";
import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import { projectDetailPath } from "@/config/constants";
import type { Project } from "@/types/content";
import { getProjectTechBadgeList } from "@/utils/projectTechBadges";
import styles from "./ProjectsPage.module.css";

function ProjectCard({ project }: { project: Project }) {
  const techList = getProjectTechBadgeList(project);
  const imageUrl = project.imageUrl?.trim();
  const imageAlt = project.imageAlt?.trim() || project.title;

  return (
    <article className={styles.card}>
      <Link to={projectDetailPath(project.slug)} className={styles.cardImageLink} tabIndex={-1}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className={styles.cardImage}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.cardImagePlaceholder} aria-hidden="true">
            <span className={styles.cardImageInitial}>{project.title.slice(0, 1)}</span>
          </div>
        )}
      </Link>
      <div className={styles.cardBody}>
      <h2 className={styles.cardTitle}>
        <Link to={projectDetailPath(project.slug)} className={styles.cardTitleLink}>
          {project.title}
        </Link>
      </h2>
      <p className={styles.cardDesc}>{project.description}</p>
      {techList.length > 0 && (
        <ul className={styles.techList}>
          {techList.map((tech) => (
            <li key={tech} className={styles.techTag}>
              {tech}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.links}>
        <Link to={projectDetailPath(project.slug)} className={styles.caseLink}>
          Case study
        </Link>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Demo
          </a>
        )}
      </div>
      </div>
    </article>
  );
}

export function ProjectsPage() {
  const { content } = useContent();

  if (!content) {
    return null;
  }

  return (
    <PageLayout settings={content.settings}>
      <div className="container">
        <h1 className={styles.title}>Projeler</h1>
        <p className={styles.subtitle}>
          Geliştirdiğim projeler ve kullandığım yaklaşımlar.
        </p>
        <div className={styles.projectsGrid}>
          {content.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {content.projects.length === 0 && (
            <p className={styles.empty}>Henüz proje eklenmemiş.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
