import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ROUTES } from "@/config/constants";
import styles from "./AdminLoginPage.module.css";

export function AdminLoginPage() {
  const { isAuthenticated, loading, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Giriş başarısız. Kullanıcı adı veya şifre hatalı."
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.loading}>Kontrol ediliyor...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Girişi</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Kullanıcı adı
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={styles.input}
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit}>
            Giriş
          </button>
        </form>
      </div>
    </div>
  );
}
