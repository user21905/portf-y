import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import type { Project } from "@/types/content";
import styles from "../AdminForm.module.css";

const EMPTY_PROJECT_FORM = {
  title: "",
  description: "",
  techStack: "",
  slug: "",
  technologies: "",
  challenge: "",
  solution: "",
  isFeatured: false,
  githubUrl: "",
  demoUrl: "",
  imageUrl: "",
  imageAlt: "",
  caseStudyContent: "",
};

function ProjectFormFields({
  form,
  setForm,
  projectFormError,
}: {
  form: typeof EMPTY_PROJECT_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_PROJECT_FORM>>;
  projectFormError: string;
}) {
  return (
    <>
      <label className={styles.label}>
        Proje Adı
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Açıklama
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
          className={styles.textarea}
        />
      </label>
      <label className={styles.label}>
        Teknolojiler (virgülle)
        <input
          value={form.techStack}
          onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))}
          required
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Rozet teknolojileri
        <input
          value={form.technologies}
          onChange={(e) => setForm((p) => ({ ...p, technologies: e.target.value }))}
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Slug
        <input
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          className={styles.input}
          placeholder="ornek-proje"
        />
      </label>
      <label className={styles.label}>
        Kapak Fotoğrafı URL
        <input
          value={form.imageUrl}
          onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
          type="url"
          className={styles.input}
          placeholder="https://..."
        />
        {form.imageUrl.trim() && (
          <div className={styles.imagePreviewWrap}>
            <img
              src={form.imageUrl.trim()}
              alt="Önizleme"
              className={styles.imagePreview}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </label>
      <label className={styles.label}>
        Görsel alt metni
        <input
          value={form.imageAlt}
          onChange={(e) => setForm((p) => ({ ...p, imageAlt: e.target.value }))}
          className={styles.input}
          required={Boolean(form.imageUrl.trim())}
        />
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
        />
        Ana sayfada öne çıkar
      </label>
      {projectFormError && <p className={styles.formError}>{projectFormError}</p>}
    </>
  );
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_PROJECT_FORM);
  const [projectFormError, setProjectFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProjects = () => {
    setLoading(true);
    adminApi
      .getProjects()
      .then(setProjects)
      .catch((e) => setError(e instanceof Error ? e.message : "Yüklenemedi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_PROJECT_FORM);
    setProjectFormError("");
    setEditingId(null);
    setModalMode("create");
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      slug: p.slug,
      technologies: p.technologies ?? "",
      challenge: p.challenge,
      solution: p.solution,
      isFeatured: p.isFeatured,
      githubUrl: p.githubUrl ?? "",
      demoUrl: p.demoUrl ?? "",
      imageUrl: p.imageUrl ?? "",
      imageAlt: p.imageAlt ?? "",
      caseStudyContent: p.caseStudyContent ?? "",
    });
    setProjectFormError("");
    setEditingId(p.id);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setProjectFormError("");
  };

  const validateImage = () => {
    if (form.imageUrl.trim() && !form.imageAlt.trim()) {
      setProjectFormError("Görsel URL girildiğinde alt metin zorunludur.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectFormError("");
    if (!validateImage()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      techStack: form.techStack.trim(),
      slug: form.slug.trim() || null,
      technologies: form.technologies.trim() || null,
      challenge: form.challenge.trim(),
      solution: form.solution.trim(),
      isFeatured: form.isFeatured,
      githubUrl: form.githubUrl.trim() || null,
      demoUrl: form.demoUrl.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      imageAlt: form.imageAlt.trim() || null,
      caseStudyContent: form.caseStudyContent.trim() || null,
    };

    setSaving(true);
    try {
      if (modalMode === "create") {
        await adminApi.createProject(payload);
      } else if (modalMode === "edit" && editingId) {
        await adminApi.updateProject(editingId, {
          ...payload,
          slug: form.slug.trim() || undefined,
        });
      }
      closeModal();
      loadProjects();
    } catch (err) {
      setProjectFormError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    await adminApi.deleteProject(id);
    loadProjects();
  };

  if (loading) return <p className={styles.loading}>Yükleniyor...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className={styles.projectsToolbar}>
        <p className={styles.pageDesc}>
          Proje kartlarını, kapak görsellerini ve vitrin ayarlarını yönetin.
        </p>
        <button type="button" onClick={openCreate} className={styles.addBtn}>
          + Yeni Proje Ekle
        </button>
      </div>

      <ul className={styles.itemList}>
        {projects.map((p) => (
          <li key={p.id} className={styles.itemRow}>
            <span className={styles.projectTitle}>
              {p.title}
              {p.isFeatured && <span className={styles.featuredMark}> ★</span>}
              <small className={styles.projectSlug}> /{p.slug}</small>
              {p.imageUrl && <img src={p.imageUrl} alt="" className={styles.projectThumb} />}
            </span>
            <div className={styles.rowActions}>
              <button type="button" onClick={() => openEdit(p)} className={styles.smallBtn}>
                Düzenle
              </button>
              <button type="button" onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
      {projects.length === 0 && <p className={styles.empty}>Henüz proje yok.</p>}

      {modalMode && (
        <div className={styles.modalOverlay} onClick={closeModal} role="presentation">
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <h3 id="project-modal-title" className={styles.modalTitle}>
              {modalMode === "create" ? "Yeni Proje Ekle" : "Projeyi Düzenle"}
            </h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <ProjectFormFields form={form} setForm={setForm} projectFormError={projectFormError} />
              <div className={styles.modalFooter}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                  İptal
                </button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Kaydediliyor..." : modalMode === "create" ? "Projeyi Ekle" : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
