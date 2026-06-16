import { usePublicSite } from "@/context/PublicSiteContext";

export function useContent() {
  return usePublicSite();
}
