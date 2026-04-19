import { cache } from "react";

import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

const DEFAULT_LANG = "id";

/**
 * API envelope: `{ status, code, message, data: [{ _id, label, ... }], pagination }`.
 * Category tabs use each item's `label`.
 */

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function withSemuaFirst(labels: string[]): string[] {
  if (!labels.length) return ["Semua"];
  return labels.some((c) => c === "Semua") ? labels : ["Semua", ...labels];
}

/**
 * Pulls the types array from common API shapes (`data` as array, or nested `data.items`, etc.).
 */
function extractTypesArray(json: unknown): unknown[] | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;

  const data = root.data;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.types)) return d.types;
    if (Array.isArray(d.galleryTypes)) return d.galleryTypes;
    if (Array.isArray(d.content)) return d.content;
  }

  if (Array.isArray(root.items)) return root.items;

  return undefined;
}

function rowToLabel(item: unknown): string | undefined {
  if (typeof item === "string") {
    const s = str(item);
    return s || undefined;
  }
  if (!item || typeof item !== "object") return undefined;
  const o = item as Record<string, unknown>;
  const label = str(
    o.label ?? o.name ?? o.title ?? o.typeName ?? o.type ?? o.slug,
  );
  return label || undefined;
}

export function normalizeGalleryTypes(json: unknown): string[] | undefined {
  const arr = extractTypesArray(json);
  if (!arr?.length) return undefined;

  const labels = arr.map(rowToLabel).filter((x): x is string => Boolean(x));
  if (!labels.length) return undefined;

  return withSemuaFirst(labels);
}

export async function requestGalleryTypesJson(): Promise<unknown> {
  const lang = DEFAULT_LANG;
  const res = await fetch(proxyUrl(`client/gallery-types?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: client/gallery-types`);
  }

  return res.json();
}

/**
 * Maps each gallery type `_id` → `label` (for resolving `type_id` on gallery items).
 */
export function buildGalleryTypeIdToLabelMap(
  json: unknown,
): Record<string, string> {
  const arr = extractTypesArray(json);
  const out: Record<string, string> = {};
  if (!arr?.length) return out;

  for (const row of arr) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const id = str(o._id ?? o.id);
    const label = str(o.label ?? o.name ?? o.title);
    if (id && label) out[id] = label;
  }
  return out;
}

/** Tabs + id→label map from one `gallery-types` JSON response. */
export function parseGalleryTypesEnvelope(json: unknown): {
  categoryTabs: string[] | undefined;
  typeIdToLabel: Record<string, string>;
} {
  return {
    categoryTabs: normalizeGalleryTypes(json),
    typeIdToLabel: buildGalleryTypeIdToLabelMap(json),
  };
}

/**
 * Fetches gallery category tabs from `GET client/gallery-types`.
 * Returns label strings (with "Semua" first when absent), or `undefined` on failure / empty.
 */
export const fetchGalleryTypes = cache(
  async function fetchGalleryTypes(): Promise<string[] | undefined> {
    try {
      const json = await withRetry(requestGalleryTypesJson, 1);
      return normalizeGalleryTypes(json);
    } catch (err) {
      console.error("[fetchGalleryTypes]", err);
      return undefined;
    }
  },
);
