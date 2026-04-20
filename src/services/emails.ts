import { escapeHtml } from "@/lib/escapeHtml";
import { proxyUrl } from "./proxyUrl";

export type ContactEmailPayload = {
  email: string;
  email_body: string;
  first_name: string;
  last_name: string;
  subject: string;
};

const DEFAULT_SUBJECT = "Pikuland — Contact form";

export function buildContactEmailBody(
  plainMessage: string,
): string {
  const safe = escapeHtml(plainMessage).replace(/\r\n/g, "\n").replace(/\n/g, "<br />");
  return `<p>${safe}</p>`;
}

/**
 * Splits a full name on whitespace: first token → `first_name`, the rest → `last_name`.
 * Single word → only `first_name`; `last_name` is `"-"` for API compatibility.
 */
export function splitFullName(fullName: string): {
  first_name: string;
  last_name: string;
} {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first_name: "", last_name: "-" };
  }
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: "-" };
  }
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}

export function buildContactEmailPayloadFromForm(values: {
  name: string;
  email: string;
  message: string;
}): ContactEmailPayload {
  const { first_name, last_name } = splitFullName(values.name);

  return {
    email: values.email.trim(),
    email_body: buildContactEmailBody(values.message),
    first_name,
    last_name,
    subject: DEFAULT_SUBJECT,
  };
}

export type PostContactEmailResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

export async function postContactEmail(
  payload: ContactEmailPayload,
): Promise<PostContactEmailResult> {
  const res = await fetch(proxyUrl("emails"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: unknown;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
}
