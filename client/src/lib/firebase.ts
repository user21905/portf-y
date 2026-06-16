import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  type Analytics,
} from "firebase/analytics";

/**
 * Firebase Web SDK yapılandırması (Firebase Console → Project Settings → General).
 * Bu değerler gizli sayılmaz; istemciye zaten açık şekilde gönderilirler.
 * Kritik güvenlik Firestore Security Rules ile yönetilir.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCz1WzqNLd1WMTUrvQezIBcH8UObipNMwQ",
  authDomain: "portfolyo-d29a4.firebaseapp.com",
  projectId: "portfolyo-d29a4",
  storageBucket: "portfolyo-d29a4.firebasestorage.app",
  messagingSenderId: "719032944361",
  appId: "1:719032944361:web:df3531a9b9e2d31f5e1278",
  measurementId: "G-4KCRXDPC3G",
} as const;

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

/**
 * Analytics yalnızca tarayıcı destekliyorsa (SSR / eski tarayıcı dışında) başlatılır.
 * Promise olarak dönüyoruz çünkü `isSupported()` asenkron çalışır.
 */
export const analyticsPromise: Promise<Analytics | null> = isAnalyticsSupported()
  .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
  .catch(() => null);
