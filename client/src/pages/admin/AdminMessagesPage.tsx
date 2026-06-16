import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/api/admin";
import type { ContactMessage } from "@/types/content";
import styles from "./AdminMessagesPage.module.css";

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = useCallback(() => {
    setLoading(true);
    adminApi
      .getMessages()
      .then(setMessages)
      .catch((e) => setError(e instanceof Error ? e.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markRead = async (id: string) => {
    await adminApi.markMessageRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) return <p className={styles.loading}>Yükleniyor...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Mesajlar</h1>
        <div className={styles.stats}>
          <span className={styles.stat}>Toplam: {messages.length}</span>
          <span className={styles.statUnread}>Okunmamış: {unreadCount}</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <p className={styles.empty}>Henüz mesaj yok.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Durum</th>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Konu</th>
                <th>Mesaj</th>
                <th>Tarih</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className={!m.isRead ? styles.unreadRow : undefined}>
                  <td>
                    {m.isRead ? (
                      <span className={styles.readBadge}>Okundu</span>
                    ) : (
                      <span className={styles.unreadBadge}>Yeni</span>
                    )}
                  </td>
                  <td>{m.name}</td>
                  <td>
                    <a href={`mailto:${m.email}`} className={styles.emailLink}>
                      {m.email}
                    </a>
                  </td>
                  <td>{m.subject || "—"}</td>
                  <td className={styles.messageCell}>{m.message}</td>
                  <td className={styles.dateCell}>
                    {new Date(m.createdAt).toLocaleString("tr-TR")}
                  </td>
                  <td>
                    {!m.isRead && (
                      <button type="button" onClick={() => markRead(m.id)} className={styles.readBtn}>
                        Okundu
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
