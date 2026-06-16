import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import styles from "./AdminForm.module.css";

export function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aboutBody, setAboutBody] = useState("");

  useEffect(() => {
    adminApi
      .getAbout()
      .then((about) => setAboutBody(about?.body ?? ""))
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    setSaving(true);
    try {
      await adminApi.updateAbout(aboutBody.trim());
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
        <h1 className={styles.pageTitle}>Hakkımda</h1>
        <p className={styles.pageDesc}>
          Ziyaretçilerin gördüğü biyografi metnini düzenleyin. Mühendislik yaklaşımınızı ve
          liderlik hikayenizi buradan güncelleyin.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formPanel}>
        <div className={styles.form}>
          <label className={styles.label}>
            Biyografi metni
            <textarea
              value={aboutBody}
              onChange={(e) => setAboutBody(e.target.value)}
              required
              className={styles.textarea}
              rows={14}
              placeholder="Mühendislik felsefeniz, teknik odak alanlarınız ve topluluk etkiniz..."
            />
          </label>
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
