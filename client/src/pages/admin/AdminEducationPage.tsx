import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import styles from "./AdminForm.module.css";

export function AdminEducationPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [courses, setCourses] = useState("");

  useEffect(() => {
    adminApi
      .getEducation()
      .then((education) => {
        setUniversity(education?.university ?? "");
        setDepartment(education?.department ?? "");
        setCourses(education?.courses ?? "");
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
      await adminApi.updateEducation({
        university: university.trim(),
        department: department.trim(),
        courses: courses.trim(),
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
        <h1 className={styles.pageTitle}>Eğitim</h1>
        <p className={styles.pageDesc}>
          Eğitim sayfasındaki üniversite, bölüm ve ders listesi bilgilerini güncelleyin.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formPanel}>
        <div className={styles.form}>
          <label className={styles.label}>
            Üniversite
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Bölüm
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Dersler / Odak Alanları
            <textarea
              value={courses}
              onChange={(e) => setCourses(e.target.value)}
              required
              className={`${styles.textarea} ${styles.textareaSm}`}
              placeholder="Yazılım Mimarisi, Veritabanı Yönetim Sistemleri, Algoritma Tasarımı..."
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
