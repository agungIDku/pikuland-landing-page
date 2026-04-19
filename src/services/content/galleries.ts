import type { GalleryImageItem } from "@/types/galleryContent";
import { cache } from "react";

import {
  parseGalleryTypesEnvelope,
  requestGalleryTypesJson,
} from "./galleryTypes";
import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

const DEFAULT_LANG = "id";

/**
 * `GET client/galleries?lang=id` — list media for the gallery grid.
 * Envelope: `{ status, data: [{ _id, label, image, type_id, ... }], pagination }`.
 * `label` = caption/title; `type_id` matches `gallery-types` item `_id` for filter tabs.
 */

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function extractGalleriesArray(json: unknown): unknown[] | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;

  const data = root.data;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.galleries)) return d.galleries;
    if (Array.isArray(d.results)) return d.results;
    if (Array.isArray(d.content)) return d.content;
  }

  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(root.galleries)) return root.galleries;

  return undefined;
}

function categoryFromRow(
  o: Record<string, unknown>,
  typeIdToLabel?: Record<string, string>,
): string | undefined {
  const tid = str(o.type_id);
  if (tid && typeIdToLabel?.[tid]) return typeIdToLabel[tid];

  const direct = str(o.category ?? o.categoryLabel ?? o.typeLabel);
  if (direct) return direct;

  const typeObj = o.type ?? o.galleryType ?? o.gallery_type;
  if (typeObj && typeof typeObj === "object") {
    const t = typeObj as Record<string, unknown>;
    const fromType = str(t.label ?? t.name ?? t.title);
    if (fromType) return fromType;
  }

  return undefined;
}

/** `label` from API is the photo caption; `-` is treated as missing. */
function altFromRow(o: Record<string, unknown>): string {
  const raw = str(o.label);
  if (raw && raw !== "-") return raw;
  return str(o.alt ?? o.title ?? o.caption ?? o.name) || "Galeri";
}

export function parseGalleryMediaItem(
  item: unknown,
  typeIdToLabel?: Record<string, string>,
): GalleryImageItem | undefined {
  if (!item || typeof item !== "object") return undefined;
  const o = item as Record<string, unknown>;
  const src = str(
    o.image ?? o.src ?? o.imageUrl ?? o.url ?? o.photo ?? o.fileUrl,
  );
  if (!src) return undefined;

  const alt = altFromRow(o);
  const category = categoryFromRow(o, typeIdToLabel) || undefined;

  return { src, alt, category };
}

export function normalizeGalleries(
  json: unknown,
  typeIdToLabel?: Record<string, string>,
): GalleryImageItem[] | undefined {
  const arr = extractGalleriesArray(json);
  if (!arr?.length) return undefined;

  const images = arr
    .map((row) => parseGalleryMediaItem(row, typeIdToLabel))
    .filter((x): x is GalleryImageItem => x != null);

  return images.length ? images : undefined;
}

async function getGalleriesJson(): Promise<unknown> {
  const lang = DEFAULT_LANG;
  const res = await fetch(proxyUrl(`client/galleries?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: client/galleries`);
  }

  return res.json();
}

/**
 * Loads `gallery-types` + `galleries` together and resolves `type_id` → tab label for filters.
 */
export const fetchGalleryPageAssets = cache(
  async function fetchGalleryPageAssets(): Promise<{
    categoryTabs: string[] | undefined;
    galleryItems: GalleryImageItem[] | undefined;
  }> {
    try {
      const [typesJson, galleriesJson] = await Promise.all([
        withRetry(requestGalleryTypesJson, 1),
        withRetry(getGalleriesJson, 1),
      ]);

      const { categoryTabs, typeIdToLabel } =
        parseGalleryTypesEnvelope(typesJson);
      const galleryItems = normalizeGalleries(galleriesJson, typeIdToLabel);

      return { categoryTabs, galleryItems };
    } catch (err) {
      console.error("[fetchGalleryPageAssets]", err);
      return { categoryTabs: undefined, galleryItems: undefined };
    }
  },
);

/**
 * Fetches gallery images from `GET client/galleries` only.
 * `type_id` on items is not resolved to labels — prefer `fetchGalleryPageAssets` on the galeri page.
 */
export const fetchGalleries = cache(async function fetchGalleries(): Promise<
  GalleryImageItem[] | undefined
> {
  try {
    const json = await withRetry(getGalleriesJson, 1);
    return normalizeGalleries(json);
  } catch (err) {
    console.error("[fetchGalleries]", err);
    return undefined;
  }
});
