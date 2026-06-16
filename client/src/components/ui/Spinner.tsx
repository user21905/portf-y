import styles from "./Spinner.module.css";

interface SpinnerProps {
  label?: string;
  size?: "sm" | "md";
}

export function Spinner({ label = "Yükleniyor", size = "md" }: SpinnerProps) {
  return (
    <span className={styles.wrap} role="status" aria-label={label}>
      <span className={size === "sm" ? styles.circleSm : styles.circle} aria-hidden />
    </span>
  );
}
