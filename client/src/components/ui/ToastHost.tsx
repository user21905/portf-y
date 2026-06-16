import { useCallback, useEffect, useState } from "react";
import { subscribeToast, type ToastVariant } from "@/lib/toast-bus";
import styles from "./ToastHost.module.css";

const TOAST_DURATION_MS = 5500;

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, variant: ToastVariant) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => subscribeToast(push), [push]);

  if (items.length === 0) return null;

  return (
    <div className={styles.region} role="region" aria-label="Bildirimler" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={
            t.variant === "success"
              ? styles.toastSuccess
              : t.variant === "info"
                ? styles.toastInfo
                : styles.toastError
          }
          role="alert"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
