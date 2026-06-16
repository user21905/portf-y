import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ROUTES } from "@/config/constants";
import {
  IconDashboard,
  IconProjects,
  IconAbout,
  IconEducation,
  IconNow,
  IconContact,
  IconMessages,
} from "./components/AdminNavIcons";
import styles from "./AdminLayout.module.css";

const ADMIN_NAV = [
  { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", Icon: IconDashboard },
  { to: ROUTES.ADMIN_PROJECTS, label: "Projeler", Icon: IconProjects },
  { to: ROUTES.ADMIN_ABOUT, label: "Hakkımda", Icon: IconAbout },
  { to: ROUTES.ADMIN_EDUCATION, label: "Eğitim", Icon: IconEducation },
  { to: ROUTES.ADMIN_NOW, label: "Şu Anda", Icon: IconNow },
  { to: ROUTES.ADMIN_CONTACT, label: "İletişim", Icon: IconContact },
  { to: ROUTES.ADMIN_MESSAGES, label: "Mesajlar", Icon: IconMessages },
] as const;

function isNavActive(pathname: string, to: string): boolean {
  return pathname === to;
}

export function AdminLayout() {
  const { isAuthenticated, loading, admin, logout } = useAdminAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === ROUTES.ADMIN_LOGIN;

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.loading}>Yükleniyor...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  if (isLoginPage) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Admin Girişi</title>
        </Helmet>
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Panel</title>
      </Helmet>
      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Admin</span>
            {admin && <span className={styles.user}>{admin.username}</span>}
          </div>
          <nav className={styles.nav} aria-label="Admin menüsü">
            {ADMIN_NAV.map(({ to, label, Icon }) => {
              const active = isNavActive(location.pathname, to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={active ? styles.navLinkActive : styles.navLink}
                >
                  <Icon className={styles.navIcon} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={styles.sidebarFooter}>
            <Link to={ROUTES.HOME} className={styles.siteLink}>
              Siteye Dön
            </Link>
            <button type="button" onClick={logout} className={styles.logout}>
              Çıkış
            </button>
          </div>
        </aside>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
