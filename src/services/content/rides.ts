import type { Lang } from "@/types/lang";
import type { RideItem } from "@/types/rideContent";
import { cache } from "react";

import { getLang } from "../lang";
import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

/**
 * `GET client/rides?lang=id` — list of wahana shown in the Services/Rides section.
 * Envelope: `{ code, data: [{ _id, label, description, image, type, is_highlight }], status }`.
 * `label`/`description` may be `{ en, id }` objects or plain strings.
 */

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

/** Resolves a `{ en, id }` localized field (or plain string) to the active locale. */
function localized(v: unknown, lang: Lang): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return str(o[lang] ?? o.id ?? o.en);
  }
  return "";
}

function extractRidesArray(json: unknown): unknown[] | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;

  if (Array.isArray(root.data)) return root.data;

  const data = root.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.rides)) return d.rides;
  }

  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(root.rides)) return root.rides;

  return undefined;
}

function parseRide(item: unknown, lang: Lang): RideItem | undefined {
  if (!item || typeof item !== "object") return undefined;
  const o = item as Record<string, unknown>;

  const title = localized(o.label ?? o.title ?? o.name, lang);
  if (!title) return undefined;

  return {
    id: str(o._id ?? o.id) || title,
    title,
    description: localized(o.description, lang),
    image: str(o.image ?? o.imageUrl ?? o.image_url) || undefined,
    type: str(o.type) || undefined,
    isHighlight: Boolean(o.is_highlight ?? o.isHighlight),
  };
}

async function getRidesJson(lang: Lang): Promise<unknown> {
  const res = await fetch(proxyUrl(`client/rides?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: client/rides`);
  }

  return res.json();
}

/**
 * Fetches the ride list (server: direct to NEXT_PUBLIC_API_URL; browser: /api/proxy/...).
 * On failure returns undefined so the Services section can fall back to static copy.
 * Wrapped in `cache` so duplicate calls in the same request dedupe.
 */
export const fetchRides = cache(async function fetchRides(): Promise<
  RideItem[] | undefined
> {
  try {
    const lang = await getLang();
    const json = await withRetry(() => getRidesJson(lang), 1);

    const arr = extractRidesArray(json);
    if (!arr?.length) return undefined;

    const rides = arr
      .map((row) => parseRide(row, lang))
      .filter((x): x is RideItem => x != null);

    return rides.length ? rides : undefined;
  } catch (err) {
    console.error("[fetchRides]", err);
    return undefined;
  }
});
