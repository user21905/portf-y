import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import type { NowCard } from "@/types/content";
import styles from "./AdminForm.module.css";

const EMPTY_NOW_CARD: NowCard = { title: "", description: "" };

export function AdminNowPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nowEyebrow, setNowEyebrow] = useState("");
  const [nowTitle, setNowTitle] = useState("");
  const [nowSubtitle, setNowSubtitle] = useState("");
  const [nowCards, setNowCards] = useState<NowCard[]>([
    EMPTY_NOW_CARD,
    EMPTY_NOW_CARD,
    EMPTY_NOW_CARD,
  ]);

  useEffect(() => {
    adminApi
      .getPageContent()
      .then((pageContent) => {
        if (!pageContent) return;
        setNowEyebrow(pageContent.nowEyebrow);
        setNowTitle(pageContent.nowTitle);
        setNowSubtitle(pageContent.nowSubtitle);
        setNowCards(
          pageContent.nowCards.length >= 3
            ? pageContent.nowCards.slice(0, 3)
            : [
                ...pageContent.nowCards,
                ...Array.from({ length: 3 - pageContent.nowCards.length }, () => ({
                  ...EMPTY_NOW_CARD,
                })),
              ]
        );
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const updateNowCard = (index: number, field: keyof NowCard, value: string) => {
    setNowCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    setSaving(true);
    try {
      await adminApi.updatePageContent({
        nowEyebrow: nowEyebrow.trim(),
        nowTitle: nowTitle.trim(),
        nowSubtitle: nowSubtitle.trim(),
        nowCards: nowCards.map((c) => ({
          title: c.title.trim(),
          description: c.description.trim(),
        })),
      });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.loading}>Yükleniyor...</p>;
  if (loadError) return <p className={styles.error}>{loadError}</p>;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Şu Anda</h1>
        <p className={styles.pageDesc}>
          Ana sayfadaki &quot;Aktif Geliştirme Süreci&quot; bölümünün başlık ve kart içeriklerini
          yönetin.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formPanel}>
        <div className={styles.form}>
          <label className={styles.label}>
            Üst başlık (eyebrow)
            <input
              value={nowEyebrow}
              onChange={(e) => setNowEyebrow(e.target.value)}
              className={styles.input}
              placeholder="Şu Anda Neler Yapıyorum?"
            />
          </label>
          <label className={styles.label}>
            Bölüm başlığı
            <input
              value={nowTitle}
              onChange={(e) => setNowTitle(e.target.value)}
              className={styles.input}
              placeholder="Aktif Geliştirme Süreci"
            />
          </label>
          <label className={styles.label}>
            Alt açıklama
            <textarea
              value={nowSubtitle}
              onChange={(e) => setNowSubtitle(e.target.value)}
              className={`${styles.textarea} ${styles.textareaSm}`}
            />
          </label>

          <p className={styles.sectionTitle}>Aktif Süreç Kartları</p>

          {nowCards.map((card, index) => (
            <div key={index} className={styles.nowCardEditor}>
              <h3 className={styles.nowCardEditorTitle}>Kart {index + 1}</h3>
              <label className={styles.label}>
                Başlık
                <input
                  value={card.title}
                  onChange={(e) => updateNowCard(index, "title", e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Açıklama
                <textarea
                  value={card.description}
                  onChange={(e) => updateNowCard(index, "description", e.target.value)}
                  className={`${styles.textarea} ${styles.textareaSm}`}
                />
              </label>
            </div>
          ))}
        </div>

        <div className={styles.formFooter}>
          {saveError && <p className={styles.formError}>{saveError}</p>}
          {saveSuccess && <p className={styles.success}>Değişiklikler kaydedildi.</p>}
          <button type="submit" disabled={saving} className={styles.saveBtn}>
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
