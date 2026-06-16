import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import { contentApi } from "@/api/content";
import { ROUTES } from "@/config/constants";
import type { Project } from "@/types/content";
import { getProjectTechBadgeList } from "@/utils/projectTechBadges";
import { Spinner } from "@/components/ui/Spinner";
import styles from "./ProjectDetailPage.module.css";

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content: siteContent } = useContent();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Geçersiz adres");
      return;
    }
    setLoading(true);
    setError(null);
    contentApi
      .getProjectBySlug(slug)
      .then(setProject)
      .catch(() => {
        setProject(null);
        setError("Proje bulunamadı veya yüklenemedi.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!siteContent) {
    return null;
  }

  const settings = siteContent.settings;
  const siteTitle = settings?.siteTitle?.trim() || "Portföy";

  if (loading) {
    return (
      <PageLayout settings={settings}>
        <div className={styles.loadingWrap} role="status" aria-live="polite">
          <Spinner label="Proje yükleniyor" />
        </div>
      </PageLayout>
    );
  }

  if (error || !project) {
    return (
      <PageLayout settings={settings}>
        <div className="container">
          <p className={styles.error}>{error ?? "Proje bulunamadı."}</p>
          <Link to={ROUTES.PROJECTS} className={styles.backLink}>
            Tüm projelere dön
          </Link>
        </div>
      </PageLayout>
    );
  }

  const badges = getProjectTechBadgeList(project);
  const imageUrl = project.imageUrl?.trim();
  const imageAlt = project.imageAlt?.trim() || project.title;
  const metaDesc = project.description.slice(0, 160);

  return (
    <PageLayout settings={settings}>
      <Helmet>
        <title>{`${project.title} | ${siteTitle}`}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={`${project.title} | ${siteTitle}`} />
        <meta property="og:description" content={metaDesc} />
      </Helmet>
      <article className={styles.article}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Gezinti">
            <Link to={ROUTES.PROJECTS}>Projeler</Link>
            <span aria-hidden="true"> / </span>
            <span>{project.title}</span>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>{project.title}</h1>
            {badges.length > 0 && (
              <ul className={styles.badgeRow} aria-label="Teknolojiler">
                {badges.map((tech) => (
                  <li key={tech} className={styles.badge}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </header>

          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt}
              className={styles.heroImage}
              loading="eager"
              decoding="async"
            />
          )}

          <section className={styles.section} aria-labelledby="goal-heading">
            <h2 id="goal-heading" className={styles.sectionTitle}>
              Amaç
            </h2>
            <div className={styles.sectionBody}>{project.description}</div>
          </section>

          {project.challenge.trim() && (
            <section className={styles.section} aria-labelledby="challenge-heading">
              <h2 id="challenge-heading" className={styles.sectionTitle}>
                Teknik zorluk
              </h2>
              <div className={styles.sectionBody}>{project.challenge}</div>
            </section>
          )}

          {project.solution.trim() && (
            <section className={styles.section} aria-labelledby="solution-heading">
              <h2 id="solution-heading" className={styles.sectionTitle}>
                Çözüm
              </h2>
              <div className={styles.sectionBody}>{project.solution}</div>
            </section>
          )}

          <div className={styles.actions}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
              >
                GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtnSecondary}
              >
                Canlı demo
              </a>
            )}
            <Link to={ROUTES.PROJECTS} className={styles.backInline}>
              Tüm projeler
            </Link>
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
