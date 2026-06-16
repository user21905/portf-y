import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import { ROUTES } from "@/config/constants";
import styles from "./GhostProtocolDetail.module.css";

interface TerminalLine {
  text: string;
  type: "system" | "success" | "info" | "message-sent" | "message-received";
  time: string;
}

export function GhostProtocolDetail() {
  const { content: siteContent } = useContent();
  const [simState, setSimState] = useState<"idle" | "scanning" | "connected">("idle");
  const [terminal, setTerminal] = useState<TerminalLine[]>([]);
  const [message, setMessage] = useState("");
  const [pinging, setPinging] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [progress, setProgress] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: TerminalLine["type"] = "info") => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTerminal((prev) => [...prev, { text, type, time }]);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminal]);

  const startDiscovery = () => {
    setSimState("scanning");
    setTerminal([]);
    addLog("P2P Ağı başlatılıyor...", "system");
    addLog("Electron ana süreci (Main Process) UDP socket oluşturdu.", "info");
    addLog("UDP Broadcast port 1900 üzerinden 'DISCOVER_PEERS' paketi yayınlanıyor...", "info");

    setTimeout(() => {
      addLog("Lokal ağ cihaz yanıtı alındı! IP: 192.168.1.104", "success");
      addLog("TCP Socket.io bağlantısı kuruluyor...", "info");
    }, 1200);

    setTimeout(() => {
      addLog("Akran (Peer) el sıkışması tamamlandı.", "success");
      addLog("Bağlantı Aktif: [Sen] <--- Socket.io ---> [Akran-104]", "system");
      setSimState("connected");
    }, 2400);
  };

  const sendPing = () => {
    if (pinging || simState !== "connected") return;
    setPinging(true);
    addLog("Ping paketi gönderiliyor (Lokal Soket)...", "info");
    
    setTimeout(() => {
      addLog("Ping yanıtı alındı: Süre = 1.8ms | Paket Bütünlüğü: OK", "success");
      setPinging(false);
    }, 800);
  };

  const sendFile = () => {
    if (transferring || simState !== "connected") return;
    setTransferring(true);
    setProgress(0);
    addLog("Dosya aktarımı başlatıldı: 'presentation.pdf' (14.2 MB)", "info");
    addLog("Dosya 256KB'lık parçalara (chunks) ayrılıyor...", "info");

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          addLog("Tüm parçalar karşı tarafa iletildi.", "info");
          addLog("SHA-256 doğrulama tamamlandı: Dosya bütünlüğü onaylandı!", "success");
          setTransferring(false);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || simState !== "connected") return;

    addLog(`Sen: ${message}`, "message-sent");
    const sentMsg = message;
    setMessage("");

    setTimeout(() => {
      if (sentMsg.toLowerCase().includes("merhaba") || sentMsg.toLowerCase().includes("selam")) {
        addLog("Akran-104: Selam! Socket.io üzerinden mesajını anında aldım. İnternet yokken bile harika çalışıyor değil mi?", "message-received");
      } else {
        addLog("Akran-104: P2P veri akışı stabil. Mesaj Zustand state havuzuna senkronize edildi.", "message-received");
      }
    }, 1000);
  };

  if (!siteContent) {
    return null;
  }

  const settings = siteContent.settings;
  const siteTitle = settings?.siteTitle?.trim() || "Portföy";

  return (
    <PageLayout settings={settings}>
      <Helmet>
        <title>{`Ghost Protocol | ${siteTitle}`}</title>
        <meta name="description" content="Ghost Protocol projesinin detaylı case study analizi ve interaktif simülasyonu." />
      </Helmet>
      
      <article className={styles.article}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Gezinti">
            <Link to={ROUTES.PROJECTS}>Projeler</Link>
            <span aria-hidden="true"> / </span>
            <span>Ghost Protocol</span>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>Ghost Protocol</h1>
            <ul className={styles.badgeRow} aria-label="Teknolojiler">
              {["Electron", "React", "TypeScript", "Tailwind CSS", "Socket.io", "Zustand"].map((tech) => (
                <li key={tech} className={styles.badge}>
                  {tech}
                </li>
              ))}
            </ul>
          </header>

          {/* Interactive Simulation Console */}
          <div className={styles.simContainer}>
            <div className={styles.simHeader}>
              <div className={styles.simDotGroup}>
                <span className={styles.simDotRed}></span>
                <span className={styles.simDotYellow}></span>
                <span className={styles.simDotGreen}></span>
              </div>
              <div className={styles.simTitle}>Ghost Protocol - Canlı P2P Simülatörü</div>
            </div>
            
            <div className={styles.simBody}>
              {/* Network Diagram Visualizer */}
              <div className={styles.visualizer}>
                <div className={styles.nodeCard}>
                  <div className={`${styles.nodeIcon} ${styles.nodeActive}`}>💻</div>
                  <div className={styles.nodeName}>Ana Bilgisayar (Sen)</div>
                  <div className={styles.nodeIp}>192.168.1.34</div>
                </div>

                <div className={styles.networkLine}>
                  {simState === "scanning" && <div className={styles.scanRadar} />}
                  {simState === "connected" && (
                    <div className={styles.connectionWire}>
                      {pinging && <div className={styles.pingPacket} />}
                      {transferring && <div className={styles.filePacket} />}
                    </div>
                  )}
                </div>

                <div className={styles.nodeCard}>
                  {simState === "connected" ? (
                    <>
                      <div className={`${styles.nodeIcon} ${styles.nodeConnected}`}>🖥️</div>
                      <div className={styles.nodeName}>Akran Bilgisayar</div>
                      <div className={styles.nodeIp}>192.168.1.104</div>
                    </>
                  ) : (
                    <>
                      <div className={`${styles.nodeIcon} ${styles.nodeOffline}`}>❓</div>
                      <div className={styles.nodeName}>Bilinmeyen Cihaz</div>
                      <div className={styles.nodeIp}>---.---.-.---</div>
                    </>
                  )}
                </div>
              </div>

              {/* Terminal Logs & Chat console */}
              <div className={styles.consoleGrid}>
                <div className={styles.terminalPanel}>
                  <div className={styles.panelTitle}>Sistem Günlüğü (Terminal)</div>
                  <div className={styles.terminalLogs}>
                    {terminal.length === 0 && (
                      <p className={styles.terminalPlaceholder}>
                        Lokal ağ taramasını başlatmak ve P2P Socket bağlantısını simüle etmek için aşağıdaki butona basın.
                      </p>
                    )}
                    {terminal.map((line, idx) => (
                      <div key={idx} className={`${styles.logLine} ${styles[line.type]}`}>
                        <span className={styles.logTime}>[{line.time}]</span>
                        <span className={styles.logText}>{line.text}</span>
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

                <div className={styles.controlPanel}>
                  <div className={styles.panelTitle}>Kontrol Paneli</div>
                  
                  {simState === "idle" && (
                    <button onClick={startDiscovery} className={styles.btnPrimary}>
                      Lokal Cihaz Keşfini Başlat (UDP Broadcast)
                    </button>
                  )}

                  {simState === "scanning" && (
                    <div className={styles.scanningIndicator}>
                      <div className={styles.spinner}></div>
                      <span>Cihazlar aranıyor, lütfen bekleyin...</span>
                    </div>
                  )}

                  {simState === "connected" && (
                    <div className={styles.activeControls}>
                      <div className={styles.btnRow}>
                        <button onClick={sendPing} disabled={pinging || transferring} className={styles.btnSecondary}>
                          {pinging ? "Ping Gönderiliyor..." : "Ping / Latency Test"}
                        </button>
                        <button onClick={sendFile} disabled={pinging || transferring} className={styles.btnSecondary}>
                          {transferring ? `Aktarılıyor %${progress}` : "Dosya Aktarımı Yap"}
                        </button>
                      </div>

                      {transferring && (
                        <div className={styles.progressContainer}>
                          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                        </div>
                      )}

                      <form onSubmit={handleSendMessage} className={styles.chatForm}>
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Lokal kanala mesaj gönder..."
                          className={styles.chatInput}
                          disabled={transferring}
                        />
                        <button type="submit" disabled={!message.trim() || transferring} className={styles.chatSendBtn}>
                          Gönder
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details & Case Study Content */}
          <div className={styles.detailsSection}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Amaç ve Genel Bakış</h2>
              <p className={styles.sectionText}>
                Ghost Protocol, merkezi bir bulut sunucusuna veya internet bağlantısına ihtiyaç duymadan, yerel ağ (LAN) üzerindeki cihazların birbirleriyle güvenli bir şekilde veri alışverişi yapabilmesi amacıyla tasarlanmıştır. Güvenlik, hız ve internet bağımsızlığının kritik olduğu ofisler, uzak şantiyeler veya yerel ekipler için özel bir P2P çözümüdür.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Teknik Zorluklar ve Aşılan Problemler</h2>
              <div className={styles.gridTwoCol}>
                <div className={styles.infoBox}>
                  <h3 className={styles.boxTitle}>Otomatik Cihaz Keşfi (Device Discovery)</h3>
                  <p className={styles.boxText}>
                    Cihazların birbirlerinin IP adreslerini önceden bilmeksizin aynı yerel ağda birbirlerini dinamik olarak bulabilmesi gerekiyordu.
                  </p>
                </div>
                <div className={styles.infoBox}>
                  <h3 className={styles.boxTitle}>Yüksek Boyutlu Dosya Transferi</h3>
                  <p className={styles.boxText}>
                    Büyük boyutlu verileri transfer ederken RAM tıkanmalarını önlemek ve dosya bütünlüğünü korumak gerekiyordu.
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Çözüm ve Mimari Detaylar</h2>
              <ul className={styles.solutionsList}>
                <li>
                  <strong>UDP Broadcast Keşfi:</strong> Uygulama açıldığında UDP soketleri üzerinden yerel ağa bir "el sıkışma" paketi yayınlanır. Aynı ağda Ghost Protocol çalıştıran diğer cihazlar bu yayını yakalayıp kendi IP ve port bilgisini dönerek bağlantıyı kurar.
                </li>
                <li>
                  <strong>Stream & Chunk Yapısı:</strong> Dosyalar Node.js fs.createReadStream API'si kullanılarak küçük veri paketlerine (chunks) bölünür. Karşı tarafa Socket.io ile parça parça aktarılır. Bu sayede gigabaytlarca büyüklükteki dosyalar dahi minimum RAM kullanımıyla aktarılabilir.
                </li>
                <li>
                  <strong>SHA-256 Veri Doğrulaması:</strong> Gönderilen dosyanın hash değeri transferden önce hesaplanır. Karşı tarafta birleştirilen dosyanın hash değeri ile karşılaştırılarak veri kaybı olup olmadığı kesin bir şekilde tespit edilir.
                </li>
              </ul>
            </section>
          </div>

          <div className={styles.actions}>
            <Link to={ROUTES.PROJECTS} className={styles.backInline}>
              ← Tüm projelere geri dön
            </Link>
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
