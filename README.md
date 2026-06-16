# Portföy Web Sitesi

Yazılım mühendisliği öğrencisi için yönetilebilir içerikli, admin panelli portföy sitesi. Clean Code ve katmanlı mimari prensiplerine uygun geliştirilmiştir.

## Teknolojiler

- **Frontend:** React 18, Vite, TypeScript, React Router, Firebase Web SDK (Analytics)
- **Backend:** Node.js, Express, TypeScript
- **Veritabanı:** Firebase Firestore (Firebase Admin SDK)
- **Kimlik doğrulama:** JWT (httpOnly cookie)

## Proje Yapısı

```
potfolyö/
├── client/                 # React SPA
│   └── src/
│       ├── api/            # API client
│       ├── components/     # UI bileşenleri
│       ├── config/         # Sabitler
│       ├── hooks/          # React hooks
│       ├── lib/            # Firebase web init, yardımcılar
│       ├── pages/          # Sayfa bileşenleri
│       ├── styles/         # Global CSS
│       └── types/          # TypeScript tipleri
├── server/                 # Express API
│   └── src/
│       ├── config/         # Ortam ve sabitler
│       ├── lib/            # Firebase Admin init
│       ├── middleware/     # Auth, validation
│       ├── repositories/   # Firestore veri erişim katmanı
│       ├── routes/         # API route'ları
│       ├── services/       # İş mantığı katmanı
│       ├── types/          # Entity tipleri
│       └── seed.ts         # İlk veri yükleme scripti
└── package.json           # Kök scriptler
```

## Firebase Kurulumu

1. **Firebase projesi hazırla**
   - [Firebase Console](https://console.firebase.google.com/) → Add project.
   - Bu proje için mevcut: `portfolyo-d29a4`.
   - **Build → Firestore Database** altında "Create database" ile Firestore'u **production mode** olarak aç (tercih edilen bölge: `eur3` ya da `europe-west`).

2. **Service account anahtarı indir** (sunucu tarafı için gerekli)
   - Firebase Console → **Project Settings → Service accounts** sekmesi.
   - "Generate new private key" tuşuna bas, indirilen JSON dosyasını güvenli bir yere koy.
   - İki seçenek var:
     - **(A) Inline env:** JSON'dan `project_id`, `client_email`, `private_key` alanlarını `server/.env` içine aktar.
     - **(B) Dosya ile:** JSON'u `server/firebase-service-account.json` olarak kaydet, `.env` içinde `GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json` satırını aç.
   - `.gitignore` bu dosyayı zaten hariç tutuyor.

3. **Firestore Security Rules** (opsiyonel ama önerilir)

   Bu proje tüm istemci isteklerini Express API üzerinden Firestore'a proxy'liyor. Bu yüzden Firestore'a doğrudan istemci erişimini kapatabilirsin:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

   (Admin SDK bu kurallardan muaftır; API'miz sorunsuz çalışır.)

## Kurulum

1. **Bağımlılıkları yükle**

   ```bash
   npm install              # kökteki concurrently vs.
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

2. **Sunucu ortam değişkenleri**

   `server/.env` dosyasını `server/.env.example` şablonuna bakarak doldur:

   - `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` → service account anahtarından
   - `JWT_SECRET` → güçlü rastgele anahtar
   - `PORT` → varsayılan `3001`
   - `CLIENT_ORIGIN` → frontend adresi (geliştirme: `http://localhost:5173`)
   - `PUBLIC_SITE_URL` → sitemap/robots için kanonik URL (opsiyonel)

3. **Seed verileri yükle**

   ```bash
   npm run db:seed
   # veya: cd server && npm run db:seed
   ```

   Bu komut şunları oluşturur:
   - `admins` koleksiyonunda `admin` / `admin123` kullanıcısı
   - `siteSettings`, `homeContent`, `aboutContent`, `education` singleton dokümanları
   - Örnek öne çıkan proje (`projects/ghost-protocol`)

4. **Çalıştır**

   ```bash
   npm run dev              # backend + frontend
   ```

   Ayrı terminallerde:

   ```bash
   npm run dev:server       # http://localhost:3001
   npm run dev:client       # http://localhost:5173
   ```

## Firestore veri modeli

| Koleksiyon         | Tip             | Anahtar alanlar                                                  |
| ------------------ | --------------- | ---------------------------------------------------------------- |
| `admins`           | Çoklu doküman   | `username` (sorgu), `password` (bcrypt hash), `createdAt`        |
| `siteSettings`     | Singleton (`default`) | SEO ayarları + sosyal link alanları                        |
| `homeContent`      | Singleton (`default`) | Ana sayfa intro, headline, CTA                             |
| `aboutContent`     | Singleton (`default`) | Hakkımda gövde metni                                       |
| `education`        | Singleton (`default`) | Üniversite, bölüm, dersler                                 |
| `skills`           | Çoklu doküman   | `name`, `category`, `orderNum`, `createdAt`                      |
| `projects`         | Çoklu doküman   | `slug` (benzersiz, sorguyla kontrol edilir), içerik + görsel     |
| `contactMessages`  | Çoklu doküman   | `name`, `email`, `subject`, `message`, `isRead`, `createdAt`     |

Tekil (singleton) dokümanlar sabit id `default` ile saklanır; bu sayede okuma deterministiktir.

## Varsayılan admin girişi

- **Kullanıcı adı:** `admin`
- **Şifre:** `admin123`

Şifreyi değiştirmek için Firestore Console üzerinden `admins` koleksiyonundaki dokümanın `password` alanına bcrypt-hashlenmiş yeni değeri yazabilir, ya da kendi hash üretim scriptini eklerisin.

## Kullanıcı sayfaları

- **Ana Sayfa:** Ad, başlık, kısa tanıtım, CTA butonu
- **Hakkımda:** Eğitim ve yazılıma bakış
- **Yetkinlikler:** Diller, web teknolojileri, kavramlar (admin’den yönetilir)
- **Projeler:** Proje kartları, GitHub/Demo linkleri
- **Eğitim:** Üniversite, bölüm, dersler
- **İletişim:** Form; mesajlar admin panelde listelenir

## Admin paneli

- **URL:** `/admin` → giriş: `/admin/giris`
- **Dashboard:** Proje/mesaj sayıları, son içerikler
- **İçerik:** Ana sayfa, Hakkımda, Yetkinlikler, Projeler, Eğitim CRUD
- **Mesajlar:** İletişim formu mesajları, okundu işaretleme
- **Ayarlar:** Site başlığı, açıklama, sosyal medya, **SEO meta** (keywords, OG/Twitter, kanonik URL)

## SEO ve paylaşım (React + Vite)

Next.js kullanılmıyor; başlık ve meta etiketleri **`react-helmet-async`** ile yönetilir.

- Her kamuya açık rota için `client/src/config/page-seo.ts` içinde **segment başlığı, açıklama ve sayfa keywords** tanımlıdır; admin’deki genel keywords ile birleştirilir.
- **Open Graph** ve **Twitter Card** etiketleri `SiteHead` bileşeninde üretilir; OG görseli ve `og:image:alt` admin ayarlarından gelir.
- **`GET /sitemap.xml`** ve **`GET /robots.txt`** Express üzerinden dinamik üretilir (`admin` yolları `Disallow`). Tam site adresi için `PUBLIC_SITE_URL` veya admin’deki **Kanonik site URL** kullanılır.
- Geliştirmede Vite, bu iki yolu API sunucusuna proxy’ler (`vite.config.ts`).

## API özeti

- `GET /sitemap.xml` — Site haritası (kök, Express)
- `GET /robots.txt` — robots kuralları (kök, Express)
- `GET /api/content` — Tüm public içerik (anonim)
- `POST /api/contact` — İletişim formu (anonim)
- `POST /api/auth/login` — Admin giriş
- `POST /api/auth/logout` — Çıkış
- `GET /api/auth/me` — Oturum bilgisi (admin)
- `/api/admin/*` — Tüm admin endpoint’leri (cookie auth gerekli)

## Üretim (Production) notları

- Firestore **Europe-West** gibi kullanıcıya yakın bir bölgeyi seç.
- Service account JSON'u asla repoya commit'leme; deployment ortamında (Vercel / Render / Fly.io / Docker) env var olarak geç.
- Büyük listelerde `orderBy` + `where` birleşimleri için Firestore Console üzerinden **composite index** oluşturman gerekebilir; konsol bunu ilk hatada otomatik öneriyor.

## Lisans

Bu proje eğitim ve portföy amaçlıdır.
