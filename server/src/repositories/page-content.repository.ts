import { FieldValue, firestore, mapDocToEntity, stripUndefined } from "../lib/firebase.js";
import { COLLECTIONS, SINGLETON_DOC_ID, type NowCard, type PageContent } from "../types/entities.js";

const docRef = () => firestore.collection(COLLECTIONS.pageContent).doc(SINGLETON_DOC_ID);

const defaultNowCards: NowCard[] = [
  {
    title: "Geliştirilen Proje",
    description:
      "Kuzey Kıbrıs pazarı için KKTC Taksi Uygulaması mimarisi (MongoDB & Çoklu Panel).",
  },
  {
    title: "Teknik Odak",
    description: "WebRTC P2P protokol optimizasyonları ve yapay zeka entegrasyonları.",
  },
  {
    title: "Topluluk",
    description:
      "Girne Üniversitesi Yazılım Kulübü liderliği ve gelecek dönem hackathon planlamaları.",
  },
];

const defaults = {
  heroBadge: "Yazılım Mühendisliği Öğrencisi",
  aboutSecondaryCtaLabel: "Hakkımda / Özgeçmiş",
  nowEyebrow: "Şu Anda Neler Yapıyorum?",
  nowTitle: "Aktif Geliştirme Süreci",
  nowSubtitle:
    "Geliştirme döngümde yer alan güncel projeler, teknik ilgi alanlarım ve topluluk çalışmaları.",
  nowCards: defaultNowCards,
  spotlightProjectSlug: "ghost-protocol",
  spotlightEyebrow: "Amiral Gemisi Projem",
  spotlightTitle: "Öne Çıkan Proje",
  featuredEyebrow: "Öne çıkan projeler",
  featuredTitle: "Seçili işler",
  featuredSubtitle:
    "İş ortaklığı ve ürün sunumu için seçtiğim çalışmalar — detaylar için case study sayfalarına göz atın.",
  partnershipsTitle: "Yeni Projeler ve Stratejik İş Birlikleri",
  partnershipsBody:
    "Fikirlerinizi modern teknolojileri, sağlam API'lar ve ölçeklenebilir mimarilerle çalışan gerçek ürünlere dönüştürüyorum. Teknik ortaklıklar, MVP geliştirme veya projeleriniz için doğrudan iletişime geçebilirsiniz.",
    contactEmail: "celebiomerr1@gmail.com",
    contactLocation: "Kuzey Kıbrıs",
    contactReplyTime: "Genellikle 24 saat içinde dönüş yaparım",
    contactDirectTitle: "Doğrudan Bana Ulaş",
    contactDirectIntro:
      "Form dışında doğrudan e-posta ile de ulaşabilirsiniz. Stratejik iş birlikleri, teknik danışmanlık ve kurumsal projeler için her zaman açığım.",
    contactPageIntro:
      "Yeni projeler, teknik ortaklıklar ve kurumsal iş birlikleri için açığım. Fikrinizi kısaca paylaşın; en kısa sürede size dönüş yapacağım.",
};

export const pageContentRepository = {
  async findFirst(): Promise<PageContent | null> {
    const snap = await docRef().get();
    return mapDocToEntity<PageContent>(snap);
  },

  async upsert(data: {
    heroBadge?: string;
    aboutSecondaryCtaLabel?: string;
    nowEyebrow?: string;
    nowTitle?: string;
    nowSubtitle?: string;
    nowCards?: NowCard[];
    spotlightProjectSlug?: string | null;
    spotlightEyebrow?: string;
    spotlightTitle?: string;
    featuredEyebrow?: string;
    featuredTitle?: string;
    featuredSubtitle?: string;
    partnershipsTitle?: string;
    partnershipsBody?: string;
    contactEmail?: string;
    contactLocation?: string;
    contactReplyTime?: string;
    contactDirectTitle?: string;
    contactDirectIntro?: string;
    contactPageIntro?: string;
  }): Promise<PageContent> {
    const existing = await docRef().get();
    const patch = stripUndefined(data as Record<string, unknown>);
    const payload = existing.exists ? patch : { ...defaults, ...patch };

    await docRef().set(
      { ...payload, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    const snap = await docRef().get();
    const entity = mapDocToEntity<PageContent>(snap);
    if (!entity) throw new Error("PageContent upsert başarısız");
    return entity;
  },
};
