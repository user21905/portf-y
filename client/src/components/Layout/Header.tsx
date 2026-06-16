import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES, SITE_BRAND_NAME } from "@/config/constants";
import { handleDownloadCV } from "@/lib/printResume";
import { ResumePrintIcon } from "@/components/Resume/ResumePrintIcon";
import type { SiteSetting } from "@/types/content";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: "Ana Sayfa" },
  { to: ROUTES.ABOUT, label: "Hakkımda" },
  { to: ROUTES.SKILLS, label: "Yetkinlikler" },
  { to: ROUTES.PROJECTS, label: "Projeler" },
  { to: ROUTES.EDUCATION, label: "Eğitim" },
  { to: ROUTES.CONTACT, label: "İletişim" },
] as const;

const MENU_ID = "primary-mobile-menu";

function isNavActive(pathname: string, to: string): boolean {
  if (to === ROUTES.HOME) return pathname === ROUTES.HOME;
  if (to === ROUTES.PROJECTS) {
    return pathname === ROUTES.PROJECTS || pathname.startsWith(`${ROUTES.PROJECTS}/`);
  }
  return pathname === to;
}

interface HeaderProps {
  settings: SiteSetting | null;
}

export function Header({ settings: _settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    if (menuOpen) {
      prevActiveRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      prevActiveRef.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables).filter((el) => !el.hasAttribute("data-skip-focus"));
    const first = list[0];
    const last = list[list.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || list.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerBar}`}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          {SITE_BRAND_NAME}
        </Link>

        <nav className={styles.nav} aria-label="Ana menü">
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to} className={styles.navItem}>
                <Link
                  to={to}
                  className={
                    isNavActive(location.pathname, to)
                      ? `${styles.navLink} ${styles.activeLink}`
                      : styles.navLink
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleDownloadCV}
            className={styles.cvButton}
          >
            <ResumePrintIcon size={14} />
            CV / Özgeçmiş
          </button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={styles.srOnly}>Menü</span>
          <span className={menuOpen ? styles.iconClose : styles.iconBars} aria-hidden />
        </button>
      </div>

      <div
        className={menuOpen ? styles.overlayVisible : styles.overlay}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />

      <div
        id={MENU_ID}
        ref={panelRef}
        className={menuOpen ? styles.panelOpen : styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menüsü"
        hidden={!menuOpen}
      >
        <nav aria-label="Mobil menü">
          <ul className={styles.mobileList}>
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={
                    isNavActive(location.pathname, to)
                      ? `${styles.mobileLink} ${styles.activeLink}`
                      : styles.mobileLink
                  }
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.mobileCvButton}
          onClick={() => {
            closeMenu();
            handleDownloadCV();
          }}
        >
          <ResumePrintIcon size={16} />
          CV / Özgeçmiş
        </button>

        <button type="button" className={styles.closeFooter} onClick={closeMenu}>
          Kapat
        </button>
      </div>
    </header>
  );
}
