import html2pdf from "html2pdf.js";
import { RESUME_DOWNLOAD_FILENAME } from "@/config/constants";

const PDF_OPTIONS = {
  margin: 0,
  filename: RESUME_DOWNLOAD_FILENAME,
  image: { type: "jpeg" as const, quality: 0.98 },
  html2canvas: {
    scale: 2,
    backgroundColor: "#0A0B10",
    logging: false,
    useCORS: true,
    width: 794,
    height: 1123,
    windowWidth: 794,
    windowHeight: 1123,
  },
  jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
  pagebreak: { mode: ["avoid-all"] as const },
};

/**
 * CV'yi tarayıcı yazdırma penceresi olmadan doğrudan PDF olarak indirir.
 * html2pdf.js: DOM → canvas → PDF (UTF-8 / Türkçe karakter uyumlu, kenarlık/URL yok).
 */
export async function handleDownloadCV(): Promise<void> {
  const el = document.querySelector<HTMLElement>(".resume-print-container");
  if (!el) return;

  const snapshot = {
    left: el.style.left,
    top: el.style.top,
    zIndex: el.style.zIndex,
    opacity: el.style.opacity,
    pointerEvents: el.style.pointerEvents,
  };

  el.style.left = "0";
  el.style.top = "0";
  el.style.zIndex = "-9999";
  el.style.opacity = "1";
  el.style.pointerEvents = "none";

  try {
    await html2pdf().set(PDF_OPTIONS).from(el).save();
  } finally {
    el.style.left = snapshot.left;
    el.style.top = snapshot.top;
    el.style.zIndex = snapshot.zIndex;
    el.style.opacity = snapshot.opacity;
    el.style.pointerEvents = snapshot.pointerEvents;
  }
}
