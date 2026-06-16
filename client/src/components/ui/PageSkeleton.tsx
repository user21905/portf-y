import styles from "./PageSkeleton.module.css";

export function PageSkeleton() {
  return (
    <div className={styles.root} aria-busy="true" aria-label="Sayfa yükleniyor">
      <div className="container">
        <div className={styles.headerRow}>
          <div className={styles.shimmer} style={{ width: "8rem", height: "1.25rem" }} />
        </div>
        <div className={styles.block}>
          <div className={styles.shimmer} style={{ width: "60%", height: "2rem", marginBottom: "1rem" }} />
          <div className={styles.shimmer} style={{ width: "100%", height: "0.875rem" }} />
          <div className={styles.shimmer} style={{ width: "95%", height: "0.875rem" }} />
          <div className={styles.shimmer} style={{ width: "70%", height: "0.875rem" }} />
        </div>
        <div className={styles.grid}>
          <div className={styles.card} />
          <div className={styles.card} />
        </div>
      </div>
    </div>
  );
}
