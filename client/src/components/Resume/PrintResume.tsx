import styles from "./PrintResume.module.css";
import { SITE_BRAND_NAME } from "@/config/constants";

export function PrintResume() {
  return (
    <article
      className={`print-area resume-print-container ${styles.sheet}`}
      aria-hidden="true"
    >
      <header className={styles.header}>
        <div className={styles.headerAccent} aria-hidden="true" />
        <h1 className={styles.name}>Ömer Faruk ÇELEBİ</h1>
        <p className={`${styles.role} accent-aqua`}>
          Yazılım Mühendisi Adayı &amp; Full-Stack Developer
        </p>
        <ul className={styles.contact}>
          <li className="accent-aqua">celebiomerr1@gmail.com</li>
          <li>Kıbrıs / Lefkoşa</li>
          <li className="accent-aqua">github.com/OmerFarukCelebi</li>
        </ul>
      </header>

      <div className={styles.main}>
        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} accent-lavender`}>Özet</h2>
          <p className={styles.paragraph}>
            Ölçeklenebilir web mimarileri, strictly-typed TypeScript ortamları, düşük gecikmeli P2P
            veri kanalları (WebRTC/UDP) ve Cursor AI / Antigravity gibi AI agent orchestration
            araçlarına odaklanan Yazılım Mühendisliği öğrencisiyim. Girne Üniversitesi Yazılım
            Kulübü Başkanı olarak 100+ geliştiriciye liderlik ediyor; sektör ziyaretleri ve
            hackathon&apos;larla ekosisteme değer üretiyorum. Ürün odaklı arayüzler, sağlam
            API&apos;ler ve sürdürülebilir mimari ile fikirleri ölçeklenebilir yazılıma
            dönüştürüyorum.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} accent-lavender`}>Yetkinlikler</h2>
          <dl className={styles.skillGrid}>
            <div className={styles.skillRow}>
              <dt className="accent-aqua">Core</dt>
              <dd>TypeScript, JavaScript ES6+, SQL</dd>
            </div>
            <div className={styles.skillRow}>
              <dt className="accent-aqua">Frontend</dt>
              <dd>React, Vue 3, State Management, Vuetify, TailwindCSS</dd>
            </div>
            <div className={styles.skillRow}>
              <dt className="accent-aqua">Backend</dt>
              <dd>Node.js, Express, Prisma ORM, PostgreSQL, MongoDB</dd>
            </div>
            <div className={styles.skillRow}>
              <dt className="accent-aqua">Protokoller</dt>
              <dd>WebRTC, Electron, UDP Discovery, Socket.io</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} accent-lavender`}>Öne Çıkan Projeler</h2>
          <ul className={styles.projectList}>
            <li>
              <strong className="accent-aqua">Ghost Protocol</strong> — Electron/React/WebRTC P2P
              LAN mesajlaşma; UDP keşif, düşük gecikmeli kanallar.
            </li>
            <li>
              <strong className="accent-aqua">KKTC Taxi App</strong> — Node.js/MongoDB çok panelli
              taksi ekosistemi (KKTC pazarı).
            </li>
            <li>
              <strong className="accent-aqua">Vize Canavarı</strong> — Vue 3 reaktif oyun; bileşen
              mimarisi ve state yönetimi.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} accent-lavender`}>Eğitim &amp; Liderlik</h2>
          <p className={styles.eduLead}>Girne Üniversitesi — Yazılım Mühendisliği</p>
          <ul className={styles.bulletList}>
            <li>
              Yazılım Kulübü Başkanı — 100+ üyeli topluluk; Gigabyte Ltd. sektör ziyaretleri
            </li>
            <li>DAÜ AI Summit toplu katılım koordinasyonu ve hackathon süreç yönetimi</li>
            <li>Full-stack geliştirme, P2P protokolleri ve modern web mimarileri odaklı çalışmalar</li>
          </ul>
        </section>
      </div>

      <footer className={styles.footer}>
        <span className="accent-aqua">{SITE_BRAND_NAME}</span> · Ömer Faruk ÇELEBİ · celebiomerr1@gmail.com
      </footer>
    </article>
  );
}
