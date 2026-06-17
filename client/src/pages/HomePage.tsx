import { Link } from "react-router-dom";
import { PageLayout } from "@/components/Layout/PageLayout";
import { HeroParticles } from "@/components/home/HeroParticles";
import { useContent } from "@/hooks/useContent";
import { ROUTES, projectDetailPath } from "@/config/constants";
import type { Project } from "@/types/content";
import { getProjectTechBadgeList } from "@/utils/projectTechBadges";
import styles from "./HomePage.module.css";

function FeaturedCard({ project }: { project: Project }) {
  const badges = getProjectTechBadgeList(project).slice(0, 6);
  const imageUrl = project.imageUrl?.trim();
  const imageAlt = project.imageAlt?.trim() || project.title;
  const gh = project.githubUrl?.trim();
  const demo = project.demoUrl?.trim();

  return (
    <article className={styles.featureCard}>
      <div className={styles.featureImageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} className={styles.featureImage} loading="lazy" decoding="async" />
        ) : (
          <div className={styles.featureImagePlaceholder} aria-hidden="true">
            <span className={styles.featureImageInitial}>{project.title.slice(0, 1)}</span>
          </div>
        )}
      </div>
      <div className={styles.featureBody}>
        <h3 className={styles.featureTitle}>
          <Link to={projectDetailPath(project.slug)}>{project.title}</Link>
        </h3>
        <p className={styles.featureDesc}>{project.description}</p>
        {badges.length > 0 && (
          <ul className={styles.featureBadges} aria-label="Teknolojiler">
            {badges.map((b) => (
              <li key={b} className={styles.featureBadge}>{b}</li>
            ))}
          </ul>
        )}
        <div className={styles.featureActions}>
          <Link to={projectDetailPath(project.slug)} className={styles.featureCaseLink}>Case study</Link>
          {gh && <a href={gh} target="_blank" rel="noopener noreferrer" className={styles.featureExtLink}>GitHub</a>}
          {demo && <a href={demo} target="_blank" rel="noopener noreferrer" className={styles.featureExtLink}>Canlı demo</a>}
        </div>
      </div>
    </article>
  );
}

export function HomePage() {
  const { content } = useContent();

  if (!content) return null;

  const { home, pageContent, projects, skills } = content;
  const pc = pageContent;

  const fullName = home?.fullName?.trim() || "";
  const headline = home?.headline?.trim() || "";
  const introText = home?.introText?.trim() || "";
  const heroBadge = pc?.heroBadge?.trim() || "";

  const featured = projects.filter((p) => p.isFeatured).sort((a, b) => a.orderNum - b.orderNum).slice(0, 3);

  const spotlightProject = pc?.spotlightProjectSlug
    ? projects.find((p) => p.slug === pc.spotlightProjectSlug)
    : featured[0] ?? null;

  const topSkills = [...skills].sort((a, b) => a.orderNum - b.orderNum).slice(0, 8);

  return (
    <PageLayout settings={content.settings}>
      <section className={styles.hero} aria-label="Tanıtım">
        <HeroParticles />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.homeWide}>
          {heroBadge && (
            <div className={styles.heroBadgeRow}>
              <span className={styles.heroBadge}>{heroBadge}</span>
            </div>
          )}
          <h1 className={styles.heroHeading}>
            {fullName && <span className={styles.heroName}>{fullName}</span>}
            {fullName && headline && <span className={styles.heroPipe} aria-hidden="true"> | </span>}
            {headline && <span className={styles.heroTagline}>{headline}</span>}
          </h1>
          {introText && <p className={styles.intro}>{introText}</p>}
          <div className={styles.heroActions}>
            <Link to={ROUTES.PROJECTS} className={styles.ctaPrimary}>Projeleri Gör</Link>
            <Link to={ROUTES.CONTACT} className={styles.ctaSecondary}>İletişime Geç</Link>
          </div>
        </div>
      </section>

      {pc && pc.nowCards.length > 0 && (
        <section className={styles.nowSection} aria-labelledby="now-heading">
          <div className={styles.homeWide}>
            <div className={styles.nowHeader}>
              {pc.nowEyebrow && <p className={styles.sectionEyebrow}>{pc.nowEyebrow}</p>}
              <h2 id="now-heading" className={styles.nowTitle}>{pc.nowTitle}</h2>
              {pc.nowSubtitle && <p className={styles.nowSubtitle}>{pc.nowSubtitle}</p>}
            </div>
            <div className={styles.nowGrid}>
              {pc.nowCards.map((card, i) => (
                <div key={`${card.title}-${i}`} className={styles.nowCard}>
                  <h3 className={styles.nowCardTitle}>{card.title}</h3>
                  <p className={styles.nowCardDesc}>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {spotlightProject && (
        <section className={styles.spotlightSection} aria-labelledby="spotlight-heading">
          <div className={styles.homeWide}>
            <div className={styles.spotlightHeader}>
              {pc?.spotlightEyebrow && <p className={styles.sectionEyebrow}>{pc.spotlightEyebrow}</p>}
              <h2 id="spotlight-heading" className={styles.spotlightTitle}>{pc?.spotlightTitle || "Öne Çıkan Proje"}</h2>
            </div>
            <article className={styles.spotlightCard}>
              <div className={styles.spotlightContent}>
                <span className={styles.spotlightBadge}>Spotlight</span>
                <h3 className={styles.spotlightName}>{spotlightProject.title}</h3>
                <p className={styles.spotlightDesc}>{spotlightProject.description}</p>
                <ul className={styles.spotlightTags} aria-label="Kullanılan Teknolojiler">
                  {getProjectTechBadgeList(spotlightProject).slice(0, 6).map((t) => (
                    <li key={t} className={styles.spotlightTag}>{t}</li>
                  ))}
                </ul>
                <div className={styles.spotlightActions}>
                  <Link to={projectDetailPath(spotlightProject.slug)} className={styles.spotlightButton}>
                    Case Study'yi İncele
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className={styles.featured} aria-labelledby="featured-heading">
          <div className={styles.homeWide}>
            <div className={styles.featuredHeader}>
              {pc?.featuredEyebrow && <p className={styles.sectionEyebrow}>{pc.featuredEyebrow}</p>}
              <h2 id="featured-heading" className={styles.featuredTitle}>{pc?.featuredTitle || "Seçili işler"}</h2>
              {pc?.featuredSubtitle && <p className={styles.featuredSubtitle}>{pc.featuredSubtitle}</p>}
            </div>
            <div className={styles.featuredGrid}>
              {featured.map((project) => (
                <FeaturedCard key={project.id} project={project} />
              ))}
            </div>
            <div className={styles.featuredFooter}>
              <Link to={ROUTES.PROJECTS} className={styles.featuredAll}>Tüm projeler →</Link>
            </div>
          </div>
        </section>
      )}

      {topSkills.length > 0 && (
        <section className={styles.techStrip} aria-labelledby="tech-strip-heading">
          <div className={styles.homeWide}>
            <h2 id="tech-strip-heading" className={styles.techStripTitle}>Güçlü olduğum teknolojiler</h2>
            <p className={styles.techStripSubtitle}>Üretim kalitesinde projelerde günlük kullandığım yığın</p>
            <ul className={styles.techList}>
              {topSkills.map((s) => (
                <li key={s.id} className={styles.techItem}>
                  <span className={styles.techName}>{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {pc && (
        <section className={styles.contactCta} aria-labelledby="cta-heading">
          <div className={styles.homeWide}>
            <div className={styles.contactCtaInner}>
              <h2 id="cta-heading" className={styles.contactCtaTitle}>{pc.partnershipsTitle}</h2>
              <p className={styles.contactCtaText}>{pc.partnershipsBody}</p>
              <div className={styles.contactCtaActions}>
                <Link to={ROUTES.CONTACT} className={styles.contactCtaBtn}>Mesaj gönder</Link>
                <div className={styles.contactCtaMeta}>
                  <a href={`mailto:${pc.contactEmail}`} className={styles.contactEmail}>{pc.contactEmail}</a>
                  {pc.contactReplyTime && <span className={styles.contactReplyTime}>{pc.contactReplyTime}</span>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
