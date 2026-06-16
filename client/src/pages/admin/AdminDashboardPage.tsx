import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin";
import type { DashboardStats } from "@/api/admin";
import { ROUTES } from "@/config/constants";
import styles from "./AdminDashboardPage.module.css";

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.loading}>Yükleniyor...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.projectCount}</span>
          <span className={styles.cardLabel}>Proje</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.messageCount}</span>
          <span className={styles.cardLabel}>Mesaj</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.unreadCount}</span>
          <span className={styles.cardLabel}>Okunmamış</span>
        </div>
      </div>
      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Son Projeler</h2>
          {stats.recentProjects.length === 0 ? (
            <p className={styles.empty}>Henüz proje yok.</p>
          ) : (
            <ul className={styles.list}>
              {stats.recentProjects.map((p) => (
                <li key={p.id}>
                  <Link to={ROUTES.ADMIN_PROJECTS} className={styles.link}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Son Mesajlar</h2>
          {stats.recentMessages.length === 0 ? (
            <p className={styles.empty}>Henüz mesaj yok.</p>
          ) : (
            <ul className={styles.list}>
              {stats.recentMessages.map((m) => (
                <li key={m.id} className={!m.isRead ? styles.unread : undefined}>
                  <Link to={ROUTES.ADMIN_MESSAGES} className={styles.link}>
                    {m.name}: {m.subject || m.message.slice(0, 30)}…
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
