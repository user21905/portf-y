import { ProjectsManager } from "./components/ProjectsManager";
import styles from "./AdminForm.module.css";

export function AdminProjectsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projeler</h1>
      </header>
      <div className={styles.formPanel}>
        <ProjectsManager />
      </div>
    </div>
  );
}
