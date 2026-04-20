import type { CareerJob } from "@/types/careerJob";
import { cache } from "react";

import { getLang } from "../lang";
import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function formatDueDateId(iso: string): string {
  const trimmed = str(iso);
  if (!trimmed) return "";
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed;
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return trimmed;
  }
}

function extractCareersDataArray(json: unknown): unknown[] | undefined {
  if (!json || typeof json !== "object") return undefined;
  const root = json as Record<string, unknown>;
  const data = root.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.careers)) return d.careers;
  }
  if (Array.isArray(root.items)) return root.items;
  return undefined;
}

function parseStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map((x) => (typeof x === "string" ? str(x) : str((x as { text?: string })?.text)))
    .filter(Boolean);
  return out.length ? out : undefined;
}

export function parseCareerJobRow(row: unknown): CareerJob | undefined {
  if (!row || typeof row !== "object") return undefined;
  const o = row as Record<string, unknown>;

  const id = str(o._id ?? o.id);
  const title = str(o.title);
  if (!id || !title) return undefined;

  const department = str(o.department) || "Umum";
  const type =
    str(o.type ?? o.employment_type ?? o.job_type ?? o.contract_type) || "—";

  const description =
    o.description !== undefined ? String(o.description).trim() : "";

  const qualifications =
    parseStringArray(o.qualifications) ??
    parseStringArray(o.requirements) ??
    parseStringArray(o.skills);

  const dueRaw = str(o.due_date ?? o.dueDate ?? o.deadline);
  const dueDateLabel = dueRaw ? formatDueDateId(dueRaw) : "";

  const email = str(o.email) || "careers@pikuland.com";
  const location = str(o.location) || undefined;

  return {
    id,
    title,
    department,
    type,
    description,
    qualifications,
    dueDateLabel,
    email,
    location,
  };
}

export function normalizeCareersList(json: unknown): CareerJob[] | undefined {
  const arr = extractCareersDataArray(json);
  if (!arr?.length) return undefined;

  const jobs = arr
    .map(parseCareerJobRow)
    .filter((x): x is CareerJob => x != null);

  return jobs.length ? jobs : undefined;
}

async function getCareersJson(): Promise<unknown> {
  const lang = await getLang();
  const res = await fetch(proxyUrl(`client/careers?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: client/careers`);
  }

  return res.json();
}

/**
 * Career job list from `GET client/careers`.
 */
export const fetchCareersList = cache(async function fetchCareersList(): Promise<
  CareerJob[] | undefined
> {
  try {
    const json = await withRetry(getCareersJson, 1);
    return normalizeCareersList(json);
  } catch (err) {
    console.error("[fetchCareersList]", err);
    return undefined;
  }
});
