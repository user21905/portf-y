import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import styles from "./EducationPage.module.css";

const DEFAULT_COURSES = [
  "Yazılım Mimarisi",
  "Veritabanı Yönetim Sistemleri",
  "Algoritma Tasarımı",
  "Veri Yapıları",
  "Nesne Yönelimli Programlama",
];

export function EducationPage() {
  const { content } = useContent();

  if (!content) {
    return null;
  }

  const education = content.education;
  const university = education?.university ?? "Girne Üniversitesi";
  const department = education?.department ?? "Yazılım Mühendisliği";
  const courses = education?.courses
    ? education.courses.split(",").map((c) => c.trim()).filter(Boolean)
    : DEFAULT_COURSES;

  return (
    <PageLayout settings={content.settings}>
      <div className="container">
        <h1 className={styles.title}>Eğitim & Deneyim</h1>
        <p className={styles.pageSubtitle}>
          Akademik temel ile topluluk liderliğini birleştiren; sektöre doğrudan değer üreten
          bir gelişim yolu.
        </p>

        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine} />

          <div className={styles.timelineItem}>
            <div className={styles.timelineBadge} aria-hidden="true">
              🎓
            </div>
            <div className={styles.timelineCard}>
              <span className={styles.timelineDate}>Lisans Eğitimi</span>
              <h2 className={styles.cardTitle}>{department}</h2>
              <h3 className={styles.cardSubtitle}>{university}</h3>
              <p className={styles.experienceText}>
                Endüstrinin beklediği mühendislik disiplinlerine odaklanıyorum: yazılım
                mimarisi, veritabanı yönetimi, algoritma tasarımı ve ölçeklenebilir sistem
                düşüncesi. Teoriyi sahada test eden akademik projelerle bu bilgiyi somut
                ürünlere dönüştürüyorum.
              </p>
              {courses.length > 0 && (
                <div className={styles.coursesSection}>
                  <h4 className={styles.coursesTitle}>Endüstri Odaklı Alanlar</h4>
                  <ul className={styles.courseList}>
                    {courses.map((c) => (
                      <li key={c} className={styles.courseItem}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.projectsSection}>
                <h4 className={styles.coursesTitle}>Akademik Case Study</h4>
                <p className={styles.projectHighlight}>
                  <strong>Vize Canavarı (Vue.js)</strong> — Sınav hazırlık sürecini
                  dijitalleştiren, Vue 3 tabanlı interaktif platform. Bileşen mimarisi, durum
                  yönetimi ve kullanıcı odaklı arayüz tasarımını gerçek bir ürün senaryosunda
                  uyguladığım pratik bir vaka.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineBadge} aria-hidden="true">
              🚀
            </div>
            <div className={styles.timelineCard}>
              <span className={styles.timelineDate}>Liderlik & Topluluk Etkisi</span>
              <h2 className={styles.cardTitle}>Girne Üniversitesi Yazılım Kulübü Başkanı</h2>
              <h3 className={styles.cardSubtitle}>Girne Üniversitesi Yazılım Kulübü</h3>
              <p className={styles.experienceText}>
                100+ geliştiriciden oluşan aktif bir topluluğa stratejik liderlik ediyorum.
                Etkinlik planlamasından sektör iş birliklerine kadar uçtan uca operasyonları
                yöneterek, üyelerin teknik yetkinliklerini ve profesyonel ağlarını güçlendiriyorum.
              </p>
              <ul className={styles.experienceDetails}>
                <li>
                  100+ geliştiriciden oluşan yazılım topluluğuna stratejik liderlik ve yön
                  belirleme
                </li>
                <li>
                  Gigabyte Ltd. gibi sektör liderlerine teknik saha ziyaretlerinin planlanması
                  ve koordinasyonu
                </li>
                <li>
                  AI Summit gibi büyük ölçekli etkinliklerde geniş katılım ve organizasyon
                  yönetimi
                </li>
                <li>
                  Hackathon, atölye ve teknik seminerlerle topluluk içi üretkenliği ve iş birliğini
                  artırma
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
