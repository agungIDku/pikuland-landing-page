import type { CareerContent, CareerValueBlock } from "@/types/careerContent";
import { cache } from "react";

import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

const DEFAULT_LANG = "id";

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function parseValueBlock(v: unknown): CareerValueBlock | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const title = str(o.title);
  const description = str(o.description);
  if (!title || !description) return undefined;
  return { title, description };
}

function valuesFromRaw(
  values: unknown,
): [CareerValueBlock, CareerValueBlock, CareerValueBlock] | undefined {
  if (!values || typeof values !== "object") return undefined;
  const o = values as Record<string, unknown>;
  const a = parseValueBlock(o.firstValues);
  const b = parseValueBlock(o.secondValues);
  const c = parseValueBlock(o.thirdValues);
  if (!a || !b || !c) return undefined;
  return [a, b, c];
}

/**
 * Extracts `data.content` from career page detail response.
 */
function extractCareerContent(json: unknown): Record<string, unknown> | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    const content = d.content;
    if (content && typeof content === "object" && !Array.isArray(content)) {
      return content as Record<string, unknown>;
    }
  }
  return undefined;
}

export function normalizeCareerContent(json: unknown): CareerContent | undefined {
  const raw = extractCareerContent(json);
  if (!raw) return undefined;

  const title = str(raw.title);
  if (!title) return undefined;

  const preTitle = str(raw.preTitle);
  const openPositionLabel = str(raw.openPositionLabel);
  const descRaw =
    raw.description !== undefined ? String(raw.description).trim() : "";

  const values = valuesFromRaw(raw.values);
  if (!preTitle || !openPositionLabel || !descRaw || !values) return undefined;

  return {
    title,
    preTitle,
    openPositionLabel,
    description: descRaw,
    values,
  };
}

async function getPageContentCareer(): Promise<unknown> {
  const lang = DEFAULT_LANG;
  const res = await fetch(proxyUrl(`client/pages/career?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: career`);
  }

  return res.json();
}

/**
 * Fetches and normalizes career page CMS (`data.content`).
 */
export const fetchCareerContent = cache(async function fetchCareerContent(): Promise<
  CareerContent | undefined
> {
  try {
    const json = await withRetry(getPageContentCareer, 1);
    return normalizeCareerContent(json);
  } catch (err) {
    console.error("[fetchCareerContent]", err);
    return undefined;
  }
});
