import {
  GALLERY_DEFAULT_CATEGORIES,
  GALLERY_DEFAULT_IMAGES,
} from "@/data/galleryDefaults";
import type {
  GalleryContent,
  GalleryContentApiRaw,
  GalleryImageItem,
} from "@/types/galleryContent";
import { cache } from "react";

import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

const DEFAULT_LANG = "id";

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function looksLikeHtml(s: string): boolean {
  return /<[^>]+>/.test(s);
}

/** Plain text from CMS HTML (for `subtitle` when `subtitleHtml` is used). */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractGalleryPayload(
  json: unknown,
): GalleryContentApiRaw | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const nested = d.content;
    if (nested && typeof nested === "object") {
      return nested as GalleryContentApiRaw;
    }
    if (
      "images" in d ||
      "items" in d ||
      "title" in d ||
      "description" in d
    ) {
      return d as GalleryContentApiRaw;
    }
  }
  const top = root.content;
  if (top && typeof top === "object") {
    return top as GalleryContentApiRaw;
  }
  if (
    "images" in root ||
    "items" in root ||
    "title" in root ||
    "description" in root
  ) {
    return root as GalleryContentApiRaw;
  }
  return undefined;
}

function parseImageItem(item: unknown): GalleryImageItem | undefined {
  if (!item || typeof item !== "object") return undefined;
  const o = item as Record<string, unknown>;
  const src = str(o.src ?? o.imageUrl ?? o.url ?? o.image);
  const alt = str(o.alt ?? o.title ?? o.caption ?? "Galeri");
  const category = str(o.category ?? o.categoryLabel) || undefined;
  if (!src) return undefined;
  return { src, alt, category };
}

function normalizeImages(v: unknown): GalleryImageItem[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map(parseImageItem)
    .filter((x): x is GalleryImageItem => x != null);
  return out.length ? out : undefined;
}

function normalizeCategories(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: string[] = [];
  for (const row of v) {
    if (typeof row === "string") {
      const s = str(row);
      if (s) out.push(s);
    } else if (row && typeof row === "object") {
      const o = row as Record<string, unknown>;
      const label = str(o.label ?? o.name ?? o.title);
      if (label) out.push(label);
    }
  }
  return out.length ? out : undefined;
}

function withSemuaTab(categories: string[]): string[] {
  const rawCats = categories.length ? categories : ["Semua"];
  return rawCats.some((c) => c === "Semua")
    ? rawCats
    : ["Semua", ...rawCats];
}

/**
 * Production payload is often only `{ title, description }` with HTML in `description`.
 * Images / categories fall back to local defaults when omitted.
 */
export function normalizeGalleryContent(
  raw: GalleryContentApiRaw | undefined,
): GalleryContent | undefined {
  if (!raw) return undefined;
  const r = raw as Record<string, unknown>;

  const title = str(raw.title ?? r.pageTitle);
  if (!title) return undefined;

  const descRaw =
    raw.description !== undefined ? String(raw.description).trim() : "";
  const subPlain = str(raw.subtitle);

  let subtitle: string;
  let subtitleHtml: string | undefined;

  if (descRaw && looksLikeHtml(descRaw)) {
    subtitleHtml = descRaw;
    subtitle = stripHtml(descRaw) || subPlain;
  } else if (descRaw) {
    subtitle = subPlain || descRaw;
  } else {
    subtitle = subPlain;
  }

  const categoriesRaw = normalizeCategories(
    raw.categories ?? r.categoryTabs ?? r.categories,
  );
  const categories = withSemuaTab(
    categoriesRaw?.length ? categoriesRaw : [...GALLERY_DEFAULT_CATEGORIES],
  );

  const images =
    normalizeImages(raw.images ?? raw.items ?? r.gallery) ??
    GALLERY_DEFAULT_IMAGES;

  return {
    title,
    subtitle,
    subtitleHtml,
    categories,
    images,
  };
}

async function getPageContentGallery(): Promise<unknown> {
  const lang = DEFAULT_LANG;
  const res = await fetch(proxyUrl(`client/pages/gallery?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: gallery`);
  }

  return res.json();
}

/**
 * Fetches gallery CMS from `client/pages/gallery`.
 * Returns `undefined` when the request fails or `title` is missing.
 */
export const fetchGalleryContent = cache(
  async function fetchGalleryContent(): Promise<GalleryContent | undefined> {
    try {
      const json = await withRetry(getPageContentGallery, 1);
      const raw = extractGalleryPayload(json);
      return normalizeGalleryContent(raw);
    } catch (err) {
      console.error("[fetchGalleryContent]", err);
      return undefined;
    }
  },
);
