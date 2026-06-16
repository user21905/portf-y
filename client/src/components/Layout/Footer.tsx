import { Link } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import type { SiteSetting } from "@/types/content";
import styles from "./Footer.module.css";

interface FooterProps {
  settings: SiteSetting | null;
}

export function Footer({ settings }: FooterProps) {
  const githubUrl = settings?.githubUrl || "https://github.com";
  const linkedinUrl = settings?.linkedinUrl || "https://linkedin.com";
  const twitterUrl = settings?.twitterUrl || "https://twitter.com";
  const mediumUrl = "https://medium.com";

  return (
    <footer className={styles.footer}>
      <div className="containerWide">
        <div className={styles.grid}>
          {/* Column 1: Info */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Ömer Faruk Çelebi</h3>
            <p className={styles.colText}>
              Modern web teknolojileri ve ölçeklenebilir çözümler üreten yazılım mühendisi.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Navigasyon</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to={ROUTES.HOME}>Ana Sayfa</Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT}>Hakkımda</Link>
              </li>
              <li>
                <Link to={ROUTES.PROJECTS}>Projeler</Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT}>İletişim</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Sosyal Medya</h3>
            <ul className={styles.linkList}>
              {githubUrl && (
                <li>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                </li>
              )}
              {linkedinUrl && (
                <li>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    LinkedIn ↗
                  </a>
                </li>
              )}
              {mediumUrl && (
                <li>
                  <a href={mediumUrl} target="_blank" rel="noopener noreferrer">
                    Medium ↗
                  </a>
                </li>
              )}
              {twitterUrl && (
                <li>
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                    Twitter / X ↗
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright area */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} — Tüm Hakları Saklıdır
          </p>
        </div>
      </div>
    </footer>
  );
}
