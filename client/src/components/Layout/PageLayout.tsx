import { Header } from "./Header";
import { Footer } from "./Footer";
import type { SiteSetting } from "@/types/content";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  settings: SiteSetting | null;
}

export function PageLayout({ children, settings }: PageLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header settings={settings} />
      <main className={styles.main}>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
