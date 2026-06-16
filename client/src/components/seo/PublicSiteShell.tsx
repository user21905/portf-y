import { Outlet } from "react-router-dom";
import { PublicSiteProvider, usePublicSite } from "@/context/PublicSiteContext";
import { SiteHead } from "@/components/seo/SiteHead";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import styles from "./PublicSiteShell.module.css";

function PublicSiteInner() {
  const { content, loading, error, refetch } = usePublicSite();

  return (
    <>
      <SiteHead settings={content?.settings ?? null} home={content?.home ?? null} />
      {loading && <PageSkeleton />}
      {!loading && error && (
        <div className={`container ${styles.errorBox}`}>
          <p className={styles.errorText}>{error}</p>
          <button type="button" className={styles.retryBtn} onClick={() => void refetch()}>
            Tekrar dene
          </button>
        </div>
      )}
      {!loading && !error && <Outlet />}
    </>
  );
}

export function PublicSiteShell() {
  return (
    <PublicSiteProvider>
      <PublicSiteInner />
    </PublicSiteProvider>
  );
}
