import type {
  ContactContent,
  ContactFormContent,
  ContactLocationContent,
} from "@/types/contactContent";
import { cache } from "react";

import { getLang } from "../lang";
import { proxyUrl } from "../proxyUrl";
import { withRetry } from "../withRetry";

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v).trim();
}

function extractContactContent(
  json: unknown,
): Record<string, unknown> | undefined {
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

function parseForm(raw: unknown): ContactFormContent | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const title = str(o.title);
  const parentsNameLabel = str(o.parentsNameLabel);
  const parentsNamePlaceholder = str(o.parentsNamePlaceholder);
  const emailLabel = str(o.emailLabel);
  const messageLabel = str(o.messageLabel);
  const messagePlaceholder = str(o.messagePlaceholder);
  const submitButtonLabel = str(o.submitButtonLabel);

  if (
    !title ||
    !parentsNameLabel ||
    !emailLabel ||
    !messageLabel ||
    !submitButtonLabel
  ) {
    return undefined;
  }

  return {
    title,
    parentsNameLabel,
    parentsNamePlaceholder:
      parentsNamePlaceholder || "Contoh: Budi Santoso",
    emailLabel,
    messageLabel,
    messagePlaceholder:
      messagePlaceholder || "Tulis pertanyaan atau saran di sini...",
    submitButtonLabel,
  };
}

function parseLocation(raw: unknown): ContactLocationContent | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const title = str(o.title);
  const address =
    o.address !== undefined ? String(o.address).trim() : "";
  const mapsUrl = str(o.mapsUrl ?? o.mapUrl) || undefined;

  if (!title || !address) return undefined;

  return { title, address, mapsUrl };
}

export function normalizeContactContent(
  json: unknown,
): ContactContent | undefined {
  const raw = extractContactContent(json);
  if (!raw) return undefined;

  const title = str(raw.title);
  const description =
    raw.description !== undefined ? String(raw.description).trim() : "";
  const form = parseForm(raw.form);
  const location = parseLocation(raw.location);

  if (!title || !description || !form || !location) return undefined;

  return {
    title,
    description,
    form,
    location,
  };
}

async function getPageContentContact(): Promise<unknown> {
  const lang = await getLang();
  const res = await fetch(proxyUrl(`client/pages/contact?lang=${lang}`), {
    cache: "no-store",
    headers: { "Accept-Language": lang },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page content for: contact`);
  }

  return res.json();
}

/**
 * Normalized contact page CMS (`data.content`).
 */
export const fetchContactContent = cache(async function fetchContactContent(): Promise<
  ContactContent | undefined
> {
  try {
    const json = await withRetry(getPageContentContact, 1);
    return normalizeContactContent(json);
  } catch (err) {
    console.error("[fetchContactContent]", err);
    return undefined;
  }
});
