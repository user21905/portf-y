import bcrypt from "bcryptjs";
import { FieldValue, firestore } from "./lib/firebase.js";
import { COLLECTIONS, SINGLETON_DOC_ID } from "./types/entities.js";

const SALT_ROUNDS = 10;

async function upsertAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", SALT_ROUNDS);
  const col = firestore.collection(COLLECTIONS.admins);
  const existing = await col.where("username", "==", "admin").limit(1).get();
  if (existing.empty) {
    await col.add({
      username: "admin",
      password: hashedPassword,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log("• admin hesabı oluşturuldu (username: admin, password: admin123)");
  } else {
    console.log("• admin hesabı zaten var, atlandı");
  }
}

async function seedSingleton<T extends Record<string, unknown>>(
  collection: string,
  payload: T
): Promise<void> {
  const ref = firestore.collection(collection).doc(SINGLETON_DOC_ID);
  await ref.set({
    ...payload,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`• ${collection}/${SINGLETON_DOC_ID} güncellendi/oluşturuldu`);
}

async function upsertProjects() {
  const col = firestore.collection(COLLECTIONS.projects);
  
  const projects = [
    {
      slug: "ghost-protocol",
      title: "Ghost Protocol",
      description:
        "Yerel ağ üzerinde internet gerektirmeden gerçek zamanlı mesajlaşma ve dosya transferi sağlayan Electron tabanlı P2P uygulaması.",
      techStack: "Electron, React, TypeScript, Tailwind CSS, Socket.io, Zustand",
      technologies: "Electron, React, TypeScript, Tailwind CSS, Socket.io, Zustand",
      challenge:
        "Sanal ağ adaptörleri, bağlantı kararlılığı ve büyük dosya transferlerinde performans sorunları olan LAN ortamında güvenilir cihaz keşfi ve düşük gecikmeli iletişim tasarlandı.",
      solution:
        "UDP broadcast ile otomatik keşif, Socket.io tabanlı P2P iletişim, chunk tabanlı dosya transferi, SHA-256 bütünlük doğrulaması ve optimistik UI yaklaşımı birleştirilerek ölçeklenebilir bir masaüstü deneyimi üretildi.",
      isFeatured: true,
      orderNum: 1,
      githubUrl: null,
      demoUrl: null,
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Ghost Protocol",
      caseStudyContent: "Ghost Protocol, yerel ağ üzerinde çalışan yüksek performanslı ve güvenli bir P2P dosya transferi ve mesajlaşma aracıdır."
    },
    {
      slug: "bismil-vinc",
      title: "Bismil Vinç",
      description:
        "Vinç kiralama hizmetleri için geliştirilmiş, yüksek SEO performanslı kurumsal web sitesi.",
      techStack: "React, Next.js, Tailwind CSS",
      technologies: "React, Next.js, Tailwind CSS",
      challenge:
        "Dinamik içerik yönetimi, yüksek yükleme hızı gereksinimleri ve yerel arama motoru optimizasyonu (SEO) ihtiyaçları.",
      solution:
        "Next.js App Router ile sunucu tarafı render etme (SSR) ve statik site oluşturma (SSG) hibrit yapısı kullanıldı. Tailwind CSS ile hızlı yüklenen responsive tasarımlar yapıldı.",
      isFeatured: true,
      orderNum: 2,
      githubUrl: null,
      demoUrl: "https://bismilvinc.com",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Bismil Vinç",
      caseStudyContent: "Bismil Vinç, vinç kiralama hizmeti sunan kurumsal bir firma için modern ve yüksek SEO odaklı bir web sitesidir."
    },
    {
      slug: "cafeport",
      title: "Cafeport Dijital Menü",
      description:
        "Kafeler için QR kod ile menüye ulaşıp doğrudan sipariş vermeyi sağlayan gerçek zamanlı web uygulaması.",
      techStack: "Vue.js, Node.js, Express, MongoDB, Socket.io",
      technologies: "Vue.js, Node.js, Express, MongoDB, Socket.io",
      challenge:
        "Eş zamanlı siparişlerin mutfak ve kasa paneline gecikmesiz iletilmesi ve masa bazlı QR kod yönlendirme entegrasyonu.",
      solution:
        "Socket.io entegrasyonu ile çift yönlü gerçek zamanlı veri akışı sağlandı. Vue.js reaktif bileşenleri ile kullanıcı dostu arayüz tasarlandı ve sipariş durumu anlık güncellendi.",
      isFeatured: true,
      orderNum: 3,
      githubUrl: null,
      demoUrl: null,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Cafeport Dijital Menü",
      caseStudyContent: "Cafeport Dijital Menü, kafeler için QR kod tabanlı, gerçek zamanlı sipariş yönetim sistemidir."
    }
  ];

  for (const payload of projects) {
    const existing = await col.where("slug", "==", payload.slug).limit(1).get();
    if (existing.empty) {
      await col.add({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`• projects/${payload.slug} oluşturuldu`);
    } else {
      const docRef = existing.docs[0].ref;
      await docRef.update({
        ...payload,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`• projects/${payload.slug} güncellendi`);
    }
  }
}

async function upsertSkills() {
  const col = firestore.collection(COLLECTIONS.skills);
  const skills = [
    { name: "TypeScript", category: "core", orderNum: 1 },
    { name: "JavaScript (ES6+)", category: "core", orderNum: 2 },
    { name: "SQL", category: "core", orderNum: 3 },
    { name: "React", category: "frontend", orderNum: 4 },
    { name: "Vue 3", category: "frontend", orderNum: 5 },
    { name: "Next.js", category: "frontend", orderNum: 6 },
    { name: "Node.js", category: "backend", orderNum: 7 },
    { name: "Express", category: "backend", orderNum: 8 },
    { name: "Prisma ORM", category: "backend", orderNum: 9 },
    { name: "PostgreSQL", category: "backend", orderNum: 10 },
    { name: "MongoDB", category: "backend", orderNum: 11 },
    { name: "WebRTC", category: "protocols", orderNum: 12 },
    { name: "Electron", category: "protocols", orderNum: 13 },
    { name: "UDP Discovery", category: "protocols", orderNum: 14 },
    { name: "Socket.io", category: "protocols", orderNum: 15 },
  ];

  for (const skill of skills) {
    const existing = await col.where("name", "==", skill.name).limit(1).get();
    if (existing.empty) {
      await col.add({
        ...skill,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log(`• skills/${skill.name} oluşturuldu`);
    } else {
      const docRef = existing.docs[0].ref;
      await docRef.update({
        ...skill,
      });
      console.log(`• skills/${skill.name} güncellendi`);
    }
  }

  const legacyNames = ["Vue.js", "Prisma"];
  for (const legacyName of legacyNames) {
    const legacy = await col.where("name", "==", legacyName).limit(1).get();
    if (!legacy.empty) {
      await legacy.docs[0].ref.delete();
      console.log(`• skills/${legacyName} (eski kayıt) silindi`);
    }
  }
}

async function main() {
  console.log("🔥 Firestore seed başladı");

  await upsertAdmin();

  await seedSingleton(COLLECTIONS.siteSettings, {
    siteTitle: "Portföy",
    siteDesc: "Yazılım Mühendisliği Öğrencisi - Kişisel Portföy",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: null,
    metaKeywords: null,
    ogImageUrl: null,
    ogImageAlt: null,
    twitterCreator: null,
    canonicalBaseUrl: null,
  });

  await seedSingleton(COLLECTIONS.homeContent, {
    fullName: "Ömer Faruk ÇELEBİ",
    headline:
      "Modern Web Teknolojileri ile Ölçeklenebilir Çözümler Üreten Yazılım Mühendisi Adayı",
    introText:
      "Ürün odaklı arayüzler, sağlam API'ler ve sürdürülebilir mimari ile fikirlerinizi ölçeklenebilir yazılıma dönüştürüyorum.",
    ctaButtonText: "Projelere Git",
  });

  await seedSingleton(COLLECTIONS.aboutContent, {
    body: `Mühendislik benim için satır satır kod yazmaktan öte, karmaşık problemleri ölçeklenebilir sistemlere dönüştürme disiplinidir. Full-stack mimariler kurarken TypeScript tabanlı, sürdürülebilir kod tabanlarını; gerçek dünya ihtiyaçlarına yanıt veren API ve arayüz katmanlarıyla birleştiriyorum.

P2P protokolleri (WebRTC/UDP) ve Electron tabanlı istemciler üzerinde düşük gecikmeli iletişim kanalları tasarlıyor; Ghost Protocol gibi projelerde teoriyi doğrudan üretime taşıyorum. Geliştirme süreçlerimde Cursor AI Agent ve Antigravity CLI ile orkestrasyon yaparak teslim hızını artırırken kalite standardını koruyorum.

Girne Üniversitesi Yazılım Kulübü Başkanı olarak 100'den fazla geliştiriciden oluşan bir topluluğa liderlik ediyor; teknik etkinlikler, sektör ziyaretleri ve hackathon'larla ekosisteme somut değer üretiyorum. Amacım net: yalnızca çalışan değil, büyüyebilen ve iş etkisi yaratan yazılımlar geliştirmek.`,
  });

  await seedSingleton(COLLECTIONS.education, {
    university: "Girne Üniversitesi",
    department: "Yazılım Mühendisliği",
    courses:
      "Yazılım Mimarisi, Veritabanı Yönetim Sistemleri, Algoritma Tasarımı, Veri Yapıları, Nesne Yönelimli Programlama",
  });

  await upsertProjects();
  await upsertSkills();

  await seedSingleton(COLLECTIONS.pageContent, {
    heroBadge: "Yazılım Mühendisliği Öğrencisi",
    aboutSecondaryCtaLabel: "Hakkımda / Özgeçmiş",
    nowEyebrow: "Şu Anda Neler Yapıyorum?",
    nowTitle: "Aktif Geliştirme Süreci",
    nowSubtitle:
      "Geliştirme döngümde yer alan güncel projeler, teknik ilgi alanlarım ve topluluk çalışmaları.",
    nowCards: [
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
    ],
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
  });

  console.log("✅ Seed tamamlandı");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  });
