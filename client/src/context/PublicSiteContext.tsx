import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { contentApi } from "@/api/content";
import type { PublicContent } from "@/types/content";

interface PublicSiteContextValue {
  content: PublicContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PublicSiteContext = createContext<PublicSiteContextValue | null>(null);

export function PublicSiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PublicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentApi.getPublic();
      setContent(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "İçerik yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  const value = useMemo(
    () => ({ content, loading, error, refetch: fetchContent }),
    [content, loading, error, fetchContent]
  );

  return (
    <PublicSiteContext.Provider value={value}>{children}</PublicSiteContext.Provider>
  );
}

export function usePublicSite(): PublicSiteContextValue {
  const ctx = useContext(PublicSiteContext);
  if (!ctx) {
    throw new Error("usePublicSite yalnızca PublicSiteProvider içinde kullanılabilir.");
  }
  return ctx;
}
