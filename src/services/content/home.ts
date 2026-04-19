import type { HomePageApiResponse, HomeContent } from "@/types/homeContent";
import { cache } from "react";

import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

const DEFAULT_LANG = "id";

export async function getPageContentHome() {
  const lang = DEFAULT_LANG;
  const res = await fetch(proxyUrl(`client/pages/home?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: home`);
  }

  return res.json() as Promise<HomePageApiResponse>;
}

/**
 * Fetches home CMS content (server: direct to NEXT_PUBLIC_API_URL; browser: /api/proxy/...).
 * On failure returns undefined so the page can fall back to static copy.
 * Wrapped in `cache` so duplicate calls in the same request dedupe.
 */
export const fetchHomeContent = cache(async function fetchHomeContent(): Promise<
  HomeContent | undefined
> {
  try {
    const data = await withRetry(getPageContentHome, 1);
    return data.data.content;
  } catch (err) {
    console.error("[fetchHomeContent]", err);
    return undefined;
  }
});
