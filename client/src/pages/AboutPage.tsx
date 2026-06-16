import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import styles from "./AboutPage.module.css";

const DEFAULT_ABOUT_BODY = `Mühendislik benim için satır satır kod yazmaktan öte, karmaşık problemleri ölçeklenebilir sistemlere dönüştürme disiplinidir. Full-stack mimariler kurarken TypeScript tabanlı, sürdürülebilir kod tabanlarını; gerçek dünya ihtiyaçlarına yanıt veren API ve arayüz katmanlarıyla birleştiriyorum.

P2P protokolleri (WebRTC/UDP) ve Electron tabanlı istemciler üzerinde düşük gecikmeli iletişim kanalları tasarlıyor; Ghost Protocol gibi projelerde teoriyi doğrudan üretime taşıyorum. Geliştirme süreçlerimde Cursor AI Agent ve Antigravity CLI ile orkestrasyon yaparak teslim hızını artırırken kalite standardını koruyorum.

Girne Üniversitesi Yazılım Kulübü Başkanı olarak 100'den fazla geliştiriciden oluşan bir topluluğa liderlik ediyor; teknik etkinlikler, sektör ziyaretleri ve hackathon'larla ekosisteme somut değer üretiyorum. Amacım net: yalnızca çalışan değil, büyüyebilen ve iş etkisi yaratan yazılımlar geliştirmek.`;

export function AboutPage() {
  const { content } = useContent();

  if (!content) {
    return null;
  }

  const body = content.about?.body?.trim() || DEFAULT_ABOUT_BODY;

  return (
    <PageLayout settings={content.settings}>
      <div className="container">
        <article className={styles.article}>
          <h1 className={styles.title}>Hakkımda</h1>
          <p className={styles.lead}>
            Ölçeklenebilir web mimarileri, P2P protokolleri ve topluluk liderliği üzerine
            inşa edilmiş bir mühendislik yaklaşımı.
          </p>
          <div className={styles.body}>{body}</div>
        </article>
      </div>
    </PageLayout>
  );
}
