export type ToastVariant = "error" | "success" | "info";

type ToastListener = (message: string, variant: ToastVariant) => void;

let listener: ToastListener | null = null;

export function subscribeToast(fn: ToastListener): () => void {
  listener = fn;
  return () => {
    listener = null;
  };
}

export function toast(message: string, variant: ToastVariant = "error"): void {
  listener?.(message, variant);
}
