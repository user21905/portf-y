import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import styles from "./AdminForm.module.css";

export function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const [contactEmail, setContactEmail] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [contactReplyTime, setContactReplyTime] = useState("");
  const [contactDirectTitle, setContactDirectTitle] = useState("");
  const [contactDirectIntro, setContactDirectIntro] = useState("");
  const [contactPageIntro, setContactPageIntro] = useState("");
  const [partnershipsTitle, setPartnershipsTitle] = useState("");
  const [partnershipsBody, setPartnershipsBody] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");

  useEffect(() => {
    Promise.all([adminApi.getPageContent(), adminApi.getSettings()])
      .then(([pageContent, settings]) => {
        if (pageContent) {
          setContactEmail(pageContent.contactEmail);
          setContactLocation(pageContent.contactLocation);
          setContactReplyTime(pageContent.contactReplyTime);
          setContactDirectTitle(pageContent.contactDirectTitle);
          setContactDirectIntro(pageContent.contactDirectIntro);
          setContactPageIntro(pageContent.contactPageIntro);
          setPartnershipsTitle(pageContent.partnershipsTitle);
          setPartnershipsBody(pageContent.partnershipsBody);
        }
        if (settings) {
          setGithubUrl(settings.githubUrl ?? "");
          setLinkedinUrl(settings.linkedinUrl ?? "");
          setTwitterUrl(settings.twitterUrl ?? "");
        }
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    setSaving(true);
    try {
      await Promise.all([
        adminApi.updatePageContent({
          contactEmail: contactEmail.trim(),
          contactLocation: contactLocation.trim(),
          contactReplyTime: contactReplyTime.trim(),
          contactDirectTitle: contactDirectTitle.trim(),
          contactDirectIntro: contactDirectIntro.trim(),
          contactPageIntro: contactPageIntro.trim(),
          partnershipsTitle: partnershipsTitle.trim(),
          partnershipsBody: partnershipsBody.trim(),
        }),
        adminApi.updateSettings({
          githubUrl: githubUrl.trim() || null,
          linkedinUrl: linkedinUrl.trim() || null,
          twitterUrl: twitterUrl.trim() || null,
        }),
      ]);
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
        <h1 className={styles.pageTitle}>İletişim</h1>
        <p className={styles.pageDesc}>
          İletişim sayfası, sosyal ağ linkleri (footer dahil) ve ana sayfadaki iş birliği CTA
          metinlerini buradan yönetin.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formPanel}>
        <div className={styles.form}>
          <p className={styles.sectionTitle}>İletişim Sayfası</p>

          <label className={styles.label}>
            Sayfa alt başlığı
            <textarea
              value={contactPageIntro}
              onChange={(e) => setContactPageIntro(e.target.value)}
              className={styles.textarea}
              rows={3}
              placeholder="Yeni projeler, teknik ortaklıklar..."
            />
          </label>

          <p className={styles.sectionTitle}>Doğrudan Bana Ulaş</p>

          <label className={styles.label}>
            Bölüm başlığı
            <input
              value={contactDirectTitle}
              onChange={(e) => setContactDirectTitle(e.target.value)}
              className={styles.input}
              placeholder="Doğrudan Bana Ulaş"
            />
          </label>
          <label className={styles.label}>
            Bölüm açıklaması
            <textarea
              value={contactDirectIntro}
              onChange={(e) => setContactDirectIntro(e.target.value)}
              className={styles.textarea}
              rows={4}
              placeholder="Form dışında doğrudan e-posta ile de ulaşabilirsiniz..."
            />
          </label>

          <label className={styles.label}>
            E-posta adresi
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="ornek@email.com"
            />
          </label>
          <label className={styles.label}>
            Konum
            <input
              value={contactLocation}
              onChange={(e) => setContactLocation(e.target.value)}
              required
              className={styles.input}
              placeholder="Kuzey Kıbrıs"
            />
          </label>
          <label className={styles.label}>
            Yanıt süresi metni
            <input
              value={contactReplyTime}
              onChange={(e) => setContactReplyTime(e.target.value)}
              className={styles.input}
              placeholder="Genellikle 24 saat içinde dönüş yaparım"
            />
          </label>

          <p className={styles.sectionTitle}>Profesyonel Ağlar</p>
          <p className={styles.sectionHint}>
            Dolu olan linkler iletişim sayfasında ve sitede footer bölümünde görünür. Boş bırakırsanız
            gizlenir.
          </p>

          <label className={styles.label}>
            GitHub URL
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className={styles.input}
              placeholder="https://github.com/kullaniciadi"
            />
          </label>
          <label className={styles.label}>
            LinkedIn URL
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className={styles.input}
              placeholder="https://linkedin.com/in/kullaniciadi"
            />
          </label>
          <label className={styles.label}>
            Twitter / X URL
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className={styles.input}
              placeholder="https://x.com/kullaniciadi"
            />
          </label>

          <p className={styles.sectionTitle}>Ana Sayfa — İş Birliği CTA</p>

          <label className={styles.label}>
            CTA başlığı
            <input
              value={partnershipsTitle}
              onChange={(e) => setPartnershipsTitle(e.target.value)}
              className={styles.input}
              placeholder="Yeni Projeler ve Stratejik İş Birlikleri"
            />
          </label>
          <label className={styles.label}>
            CTA metni
            <textarea
              value={partnershipsBody}
              onChange={(e) => setPartnershipsBody(e.target.value)}
              className={styles.textarea}
              rows={5}
              placeholder="Teknik ortaklıklar, MVP geliştirme ve kurumsal projeler..."
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
